import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email  format" });
    }

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 charecter long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImage: newUser.profileImage,
        coverImage: newUser.coverImage,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || "",
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentilas" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      following: user.following,
      followers: user.followers,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});


    return res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getMe = async(req,res)=>{

  try{

    const user = await User.findById(req.user_id);
    return res.status(200).json({message:"success"});
  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}
