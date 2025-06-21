import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utlis.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "Signup done successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.send(400).json({ message: "Invalid data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists)
      return res.status(400).json({ message: "Invalid credentials" });
    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(userExists._id, res);
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: userExists._id,
        fullName: userExists.fullName,
        email: userExists.email,
        profilePic: userExists.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is requried" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } catch (err) {}
};

export const checkAuth = (req, res) => {
  try {
    const { password, ...withoutPasswordUser } = req.user;
    res.status(200).json(withoutPasswordUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
