import app from "./src/app.js"
import {configDotenv} from "dotenv";
import connectDb from "./src/config/database.js";
import { generateInterviewReport } from "./src/services/ai.service.js";
import { jobDescription, resume, selfDescription } from "./src/services/temp.js";
configDotenv();
connectDb();
// generateInterviewReport({resume,jobDescription,selfDescription})
app.listen(3000, () => {
    console.log("Server running at PORT 3000");
})