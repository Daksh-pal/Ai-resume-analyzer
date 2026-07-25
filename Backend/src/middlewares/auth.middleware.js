import jwt from 'jsonwebtoken'
import { tokenBlacklist } from '../models/tokenBlacklisting.js';

export async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message : "Token not provided"});
    }

    const isTokenInvalid = await tokenBlacklist.findOne({token});

    if(isTokenInvalid){
        return res.status(401).json({message : "Token is invalid"});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid Token"});
    }
}