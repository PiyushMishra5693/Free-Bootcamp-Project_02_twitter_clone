import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ userName: username }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usertoModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot follow unfollow yourself" });
    }

    if (!usertoModify || !currentUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      return res.status(200).json({ message: "User Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: usertoModify._id,
      });
      await newNotification.save();
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) =>
        !userFollowByMe.following.some(
          (id) => id.toString() === user._id.toString()
        )
    );

    const suggestedUser = filteredUsers.slice(0, 4);

    suggestedUser.forEach((user) => {
      user.password = undefined;
    });

    return res.status(200).json(suggestedUser);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserProfile= async(req,res)=>{

  try {

    const {fullName,email,userName,currentPassword,newPassword,bio,link}= req.body;
    const {profileImage,coverImage}= req.body;

    const userId = req.user._id;
    let user =await User.findById(userId)


    if((!currentPassword && newPassword)||(!newPassword && currentPassword)){
      return res.status(400).json({message:"Current password and new password should match "})
    }

    if(currentPassword && newPassword){
      const isMatch =await bcrypt.compare(currentPassword,user.password);
      if(!isMatch) return res.status(400).json({message:"Current password is incorrect"});
      if(newPassword.length<6){
        return res.status(400).json({message:"Password must be atleast  6 character long"});
      }

      user.password = await bcrypt.hash(newPassword,10);

    }

    if(profileImage){
      const uploadedResponse = await cloudinary.uploader.upload(profileImage);
      user.profileImage =uploadedResponse.secure_url;
      
    }
    if(coverImage){
      const uploadedResponse = await cloudinary.uploader.upload(coverImage);
      user.coverImage =uploadedResponse.secure_url;
    }


    user.fullName =fullName|| user.fullName 
    user.email = email || user.email 
    user.userName =userName ||user.userName  ;
    user.bio= bio || user.bio;
    user.link= link || user.link;

    await user.save();

    user.password = null;

    return res.status(200).json(user);


  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}
