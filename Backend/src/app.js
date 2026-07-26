import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { interviewRouter } from './routes/interview.routes.js';
import connectDb from './config/database.js';

const app = express();

// Sanitize CLIENT_URL (remove trailing slash if present)
const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Sanitize incoming origin
        const cleanOrigin = origin.replace(/\/$/, "");

        if (
            cleanOrigin === clientUrl ||
            cleanOrigin === "http://localhost:5173" ||
            cleanOrigin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback allow for Vercel dynamic preview links
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"]
}));

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
