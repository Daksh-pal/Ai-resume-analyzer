import mongoose from "mongoose";

let isConnected = false;

async function connectDb() {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI environment variable is missing!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to DB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default connectDb;