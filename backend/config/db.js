const mongoose = require('mongoose');

// Optimized for both serverless (Vercel) and traditional server runtimes
const connectDB = async () => {
    // If connection already ready, reuse it immediately (prevents duplicate connections across warm lambdas)
    if (mongoose.connection && mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,                 // Prevents multi-lambda storms from exhausting Atlas M0 limit (500 connections)
            minPoolSize: 1,                  // Keep 1 warm connection alive
            maxIdleTimeMS: 20000,            // Close idle connections after 20s
            serverSelectionTimeoutMS: 5000,  // Fast-fail timeout after 5s
            socketTimeoutMS: 45000,          // Close inactive sockets after 45s
            family: 4                        // Force IPv4 for reliable Atlas DNS resolution
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
