/* eslint-disable no-undef */
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.status(200).json({ success: true, message: "User logged in successfully", token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // hash the password before saving to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.status(200).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in registering user");
    }
};



// route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, message: "Admin logged in successfully", token});
        } else {
            res.json({success: false, message: "Invalid admin credentials"});
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
    

// route to get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// route to update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { name, phone } = req.body;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// route to update user avatar
const updateUserAvatar = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const file = req.file;

        if (!file) {
            return res.json({ success: false, message: "Avatar image is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "afc/users/avatar",
        });

        user.avatar = uploadResult.secure_url;
        await user.save();

        res.json({
            success: true,
            message: "Profile photo updated successfully",
            avatar: user.avatar,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, updateUserAvatar };