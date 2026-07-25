import mongoose from "mongoose";

async function connectDb() {
    try {
        console.log("------------- ",process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;