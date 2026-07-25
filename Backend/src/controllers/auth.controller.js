import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "../models/tokenBlacklisting.js";

export const registerUser = async (req,res) => {
    const {username , email , password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const userExists = await User.findOne({
        $or: [{username}, {email}]
    });

    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }

    const hash = await bcrypt.hash(password,10);

    const user = await User.create({
        username,
        email,
        password:hash
    });

    const token = jwt.sign({id: user._id , username : user.username},process.env.SECRET_KEY,{expiresIn:"1h"});

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user: {
            id:user._id,
            username:user.username,
            email: user.email
        }
    })

}

export const loginUser = async (req,res) => {
    const {email , password} = req.body;
    const userExists = await User.findOne({email});

    if(!userExists){
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }
    const isPasswordValid = await bcrypt.compare(password , userExists.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({id: userExists._id , username : userExists.username},process.env.SECRET_KEY,{expiresIn:"1h"});

    res.cookie("token",token);

    res.status(201).json({
        message: "User logged in Successfully",
        user : {
            id: userExists._id,
            username: userExists.username,
            email: userExists.email
        }
    })

}

export const logoutUser = async(req,res) => {
    const token = req.cookies.token;
    if(token){
        await tokenBlacklist.create({
            token
        })
    }

    res.clearCookie("token");
    res.status(201).json({message : "User logged out successfully"});
}

export const getMe = async(req,res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        message:"User Fetched successfully",
        user : {
        id:user._id,
        username : user.username,
        email : user.email
    }});
}