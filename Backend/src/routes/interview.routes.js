import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
    generateInterviewController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} from "../controllers/interview.controller.js";
import { upload } from "../middlewares/file.middleware.js";

export const interviewRouter = Router();

interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewController);
interviewRouter.get("/", authUser, getAllInterviewReportsController);
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController);
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController);