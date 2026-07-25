
import { mongo, mongoose } from 'mongoose';



const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type : String,
        required : [true, "Technical questions is required"]
    },
    intention : {
        type:String,
        required : [true , "Intention is required"]
    },
    answer : {
        type:String,
        required : [true , "Answer is required"]
    }
},{
    _id : false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type : String,
        required : [true, "Behaviour questions is required"]
    },
    intention : {
        type:String,
        required : [true , "Intention is required"]
    },
    answer : {
        type:String,
        required : [true , "Answer is required"]
    }
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required : [true , "Skills are required"]
    },
    severity : {
        type: String,
        enum : ["low" , "medium" , "high"],
        required : [true , "Severity is required"]
    }
},{
    _id: false
})

const preprationPlanSchema = new mongoose.Schema({
    day:{
        type : Number,
        required : [true, "Day is required"]
    },
    focus: {
        type : String,
        required : [true , "Focus is required"]
    },
    tasks : [
        {
            type : String,
            required : [true , "Task is required"]
        }
    ]
})

const resumeRatingSchema = new mongoose.Schema({
    overallScore: { type: Number, min: 0, max: 100 },
    formattingScore: { type: Number, min: 0, max: 100 },
    impactScore: { type: Number, min: 0, max: 100 },
    atsCompatibilityScore: { type: Number, min: 0, max: 100 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    keyImprovements: [{ type: String }]
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resumeText: {
        type: String,
    },
    selfDescription: {
        type: String
    },
    matchScore:{
        type : Number,
        min:0,
        max:100
    },
    resumeRating: resumeRatingSchema,
    technicalQuestion : [technicalQuestionSchema],
    behaviouralQuestion : [behaviouralQuestionSchema],
    skillGaps : [skillGapSchema],
    preprationPlan : [preprationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{
    timestamps : true
})

export const InterviewReport = mongoose.model("InterviewReport",interviewReportSchema);