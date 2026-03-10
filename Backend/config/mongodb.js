/* eslint-disable no-undef */
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            // Extract database name from connection string for logging
            const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0];
            console.log(`MongoDB connected successfully to database: ${dbName}`);
        });

        mongoose.connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
            
            // Special handling for case-sensitive name conflicts
            if (err.message && err.message.includes("already exists with different case")) {
                console.error("\n=== DATABASE NAME CASE MISMATCH ERROR ===");
                console.error("The database name in your connection string doesn't match the existing database's capitalization.");
                console.error("Please check your .env file and update the MONGODB_URI to use the correct case.\n");
            }
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;