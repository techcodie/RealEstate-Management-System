const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URL || "mongodb://localhost:27017/metro_estate_db",
            {
                serverSelectionTimeoutMS: 5000,
                tls: true,
                tlsInsecure: true,
            }
        );
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
