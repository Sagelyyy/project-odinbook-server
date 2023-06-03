import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";

interface PostDocument extends Document {
  userId: ObjectId;
  content: string;
  commentCount: number;
  likeCount: number;
  likedBy: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "FacebookUser",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 5000,
  },

  commentCount: {
    type: Number,
    default: 0,
  },

  likeCount: {
    type: Number,
    default: 0,
  },

  likedBy: {
    type: [ObjectId],
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
  commentCount: number;
  likeCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostModel = mongoose.model<PostDocument>("Post", PostSchema);

export { PostModel as default, Post };
