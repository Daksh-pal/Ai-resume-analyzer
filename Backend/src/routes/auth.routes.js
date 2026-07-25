import { Router } from "express";
import { loginUser, registerUser ,logoutUser, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);
authRouter.get("/logout",logoutUser)
authRouter.get("/get-me",authUser,getMe)

export default authRouter;