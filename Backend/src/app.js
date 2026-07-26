import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { interviewRouter } from './routes/interview.routes.js';
import connectDb from './config/database.js';

const app = express();

// 1. CORS with wildcard origin dynamic reflector
app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, origin || true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"]
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
