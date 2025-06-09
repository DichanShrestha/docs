import mongoose from "mongoose";

const dbConnect = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://database:27017/docs-db";

  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnect;
