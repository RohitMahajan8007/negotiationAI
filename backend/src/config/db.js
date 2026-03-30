const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI not found in environment variables.');
    }
    try {
        await mongoose.connect(uri);
        console.log("Connected to Database Subsystem.");
    } catch (err) {
        console.error("Database connection failure:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
