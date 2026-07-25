import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse || pdfParseModule;
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.js";

export const generateInterviewController = async (req, res) => {
    try {
        const resumeFile = req.file;
        let resumeText = "";

        if (resumeFile && resumeFile.buffer) {
            const parser = typeof PDFParse === 'function' && PDFParse.prototype ? new PDFParse(new Uint8Array(resumeFile.buffer)) : null;
            if (parser && typeof parser.getText === 'function') {
                const parsedData = await parser.getText();
                resumeText = typeof parsedData === 'string' ? parsedData : (parsedData?.text || "");
            } else if (typeof pdfParseModule === 'function') {
                const parsedPdf = await pdfParseModule(resumeFile.buffer);
                resumeText = parsedPdf.text || "";
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ message: "Please provide either a Resume file or a Self Description." });
        }

        const response = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await InterviewReport.create({
            user: req.user.id,
            jobDescription,
            resumeText,
            selfDescription,
            matchScore: response.matchScore,
            resumeRating: response.resumeRating,
            technicalQuestion: response.technicalQuestions,
            behaviouralQuestion: response.behavioralQuestions,
            skillGaps: response.skillGaps,
            preprationPlan: response.preprationPlan
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Failed to generate interview strategy report.", error: error.message });
    }
};

export const getInterviewReportByIdController = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const report = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });

        if (!report) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        res.status(200).json({
            message: "Report fetched successfully",
            interviewReport: report
        });
    } catch (error) {
        console.error("Error fetching report by ID:", error);
        res.status(500).json({ message: "Server error fetching report." });
    }
};

export const getAllInterviewReportsController = async (req, res) => {
    try {
        const reports = await InterviewReport.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Reports fetched successfully",
            interviewReports: reports
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Server error fetching reports." });
    }
};

export const generateResumePdfController = async (req, res) => {
    try {
        const { interviewReportId } = req.params;
        const report = await InterviewReport.findOne({ _id: interviewReportId, user: req.user.id });

        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }

        const content = `=====================================================
AI RESUME ANALYZER & INTERVIEW STRATEGY REPORT
=====================================================
Target Job: ${report.jobDescription.substring(0, 100)}...
Match Score: ${report.matchScore}%

RESUME OVERALL RATING: ${report.resumeRating?.overallScore || 'N/A'}/100
- Formatting & Layout: ${report.resumeRating?.formattingScore || 'N/A'}/100
- Impact & Achievements: ${report.resumeRating?.impactScore || 'N/A'}/100
- ATS Compatibility: ${report.resumeRating?.atsCompatibilityScore || 'N/A'}/100

STRENGTHS:
${report.resumeRating?.strengths?.map(s => `- ${s}`).join('\n') || 'N/A'}

AREAS FOR IMPROVEMENT:
${report.resumeRating?.weaknesses?.map(w => `- ${w}`).join('\n') || 'N/A'}

ACTIONABLE RECOMMENDATIONS:
${report.resumeRating?.keyImprovements?.map(k => `- ${k}`).join('\n') || 'N/A'}

SKILL GAPS IDENTIFIED:
${report.skillGaps?.map(g => `- [${g.severity.toUpperCase()}] ${g.skill}`).join('\n') || 'None'}

PREPARATION ROADMAP:
${report.preprationPlan?.map(p => `Day ${p.day}: Focus on ${p.focus}\n  Tasks:\n${p.tasks.map(t => `   * ${t}`).join('\n')}`).join('\n\n') || 'N/A'}
=====================================================`;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="AI_Resume_Strategy_${report._id}.txt"`);
        return res.send(content);
    } catch (error) {
        console.error("Error generating report export:", error);
        res.status(500).json({ message: "Failed to generate report text." });
    }
};