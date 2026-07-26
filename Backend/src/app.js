import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { interviewRouter } from './routes/interview.routes.js';
import connectDb from './config/database.js';

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (err) {
        console.error("DB Middleware Error:", err);
        res.status(500).json({ message: "Database connection failed", error: err.message });
    }
});

app.get("/", (req, res) => {
    res.json({ status: "OK", message: "AI Resume Analyzer API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;
