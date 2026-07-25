import mongoose, { Schema } from "mongoose";


const blacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token is to be required to add in blacklist"]
    }
}, {
    timestamps: true
})

export const tokenBlacklist = mongoose.model("tokenBlacklist",blacklistTokenSchema);