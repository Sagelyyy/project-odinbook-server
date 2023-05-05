import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO as string);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
};

export const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
