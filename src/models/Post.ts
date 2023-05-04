import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";

const PostSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 5000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

interface Post {
  userId: ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostModel = mongoose.model<Post & Document>("Post", PostSchema);

export { PostModel as default, Post };
