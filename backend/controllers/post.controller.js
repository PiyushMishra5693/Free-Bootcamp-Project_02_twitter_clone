import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"
import {v2 as cloudinary} from "cloudinary"
import { populate } from "dotenv"


export const createPost = async(req,res)=>{

    try {
        const {text}= req.body;
        let {image}= req.body;
        const userId= req.user._id.toString();
    
        const user = await User.findById(userId);


        if(!user){
            return res.status(400).json({message:"No user found"});
        }

        if(!text && !image){
            return res.status(400).json({message:"Provide atleast one text or image"});
        }
        if(image){
            const updatedResponce = await cloudinary.uploader.upload(img);
            image= updatedResponce.secure_url;
        }

        const post = new Post({
            user:userId,
            text,
            image
        })

        await post.save();

        return res.status(200).json(post);


    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deletePost = async(req,res)=>{
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message:"Post not found"})
        }

        if(post.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"You are not authorize to delete this post"});
        }

        if(post.image){
            const imageId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId); 
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({message:"Post delted successfully"});


        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const commentOnPost=async(req,res)=>{
    try {
        const {text}= req.body;
        const userId = req.user._id;
        const postId= req.params.id;

        if(!text){
            return res.status(400).json({message:"You should provide some text"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"No post found"});
        }
        const comment = {user:userId,text};
        post.comments.push(comment);

        await post.save();
        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const likeDislikePost = async(req,res)=>{
    try {
        const userId = req.user._id.toString();
        const postId = req.params.id; 
        
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:"No post found"});
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}})
            return res.status(200).json({message:"Post unliked successfully"});
        }
        else{

            await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

            if (post.user.toString() !== userId) {
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
                await notification.save();
            }
         
            return res.status(200).json({message:"Post liked successfully"});

        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getAllPost= async(req,res)=>{

    try {

        const post = await Post.find({}).sort({createdAt:-1}).populate({path:"user",select:"-password"}).populate({
            path:"comments.user",
            select:"-password"
        })
        if(post.length===0){
            return res.status(400).json([]);
        }
        
        return res.status(200).json(post);
        
    } catch (error) {
         return res.status(500).json({message:error.message});

    }
}



export const getUserPost= async(req,res)=>{

    try {
        const {username}= req.params;

        const user = await User.findOne({userName:username});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const post = await Post.find({user}).sort({createdAt:-1})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user",select:"-password"});

        res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const likedUserPost = async (req, res) => {
  try {
    const likedPosts = await Post.find({ likes: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    return res.status(200).json(likedPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowingPost= async(req,res)=>{

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const following= user.following;

        const feedPosts = await Post.find({user:{$in:following}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })

        res.status(200).json(feedPosts);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
