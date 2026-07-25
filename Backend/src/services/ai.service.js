import {GoogleGenAI} from '@google/genai'
import dotenv from "dotenv";
import {z} from "zod";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_KEY || process.env.GEMINI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate's profile and the job description, represented as a percentage (0-100)."),
    resumeRating: z.object({
        overallScore: z.number().describe("Overall score of the resume out of 100."),
        formattingScore: z.number().describe("Score for layout, visual presentation, and readability out of 100."),
        impactScore: z.number().describe("Score based on quantifiable metrics, action verbs, and achievements out of 100."),
        atsCompatibilityScore: z.number().describe("Score indicating how well ATS parsers can read the resume out of 100."),
        strengths: z.array(z.string()).describe("Top highlights and positive points of the resume."),
        weaknesses: z.array(z.string()).describe("Areas where the resume falls short or lacks detail."),
        keyImprovements: z.array(z.string()).describe("Actionable suggestions to improve the resume for this job.")
    }).describe("Comprehensive feedback and rating of candidate's resume."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question asked during the interview."),
        intention: z.string().describe("The intention behind the question, e.g., to assess problem-solving skills, coding ability, etc."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take."),
    })).describe("Technical questions asked during the interview, along with their intention and suggested answers."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question asked during the interview."),
        intention: z.string().describe("The intention behind the question, e.g., to assess cultural fit, teamwork, etc."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take.")
    })).describe("Behavioral questions asked during the interview, along with their intention and suggested answers."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate needs to improve or learn."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, indicating how critical it is for the candidate's role."),
    })).describe("List of skill gaps identified in the candidate profile, along with their severity."),
    preprationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan."),
        focus: z.string().describe("The focus area for that day, e.g., specific skills, topics, or types of questions to practice."),
        tasks: z.array(z.string()).describe("List of tasks or activities to complete on that day to prepare for the interview."),
    })).describe("A structured preparation plan for the candidate, detailing daily focus areas and tasks to improve skills and readiness for the interview."),
})

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {

    const prompt = `You are an expert HR recruiter and AI Technical Interviewer. Analyze the following candidate inputs against the job description:
Resume Content: ${resume || 'None provided'}
Self Description: ${selfDescription || 'None provided'}
Job Description: ${jobDescription}

Provide a comprehensive, highly insightful evaluation, resume rating, skill gap analysis, interview technical and behavioral questions with answer guidelines, and a day-by-day preparation roadmap.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema),
        }
    })
    console.log("AI Response:", response.text);
    return JSON.parse(response.text);
}
