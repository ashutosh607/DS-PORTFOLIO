const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || "ds_portfolio";

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connectionInstance = await mongoose.connect(uri, {
      dbName,
    });

    console.log(`\n MongoDB connected successfully! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
