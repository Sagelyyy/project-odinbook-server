import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";

const CommentSchema = new mongoose.Schema({
  postId: {
    type: ObjectId,
    ref: "Post",
    required: true,
  },
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
    maxlength: 1000,
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

interface Comment {
  postId: ObjectId;
  userId: ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentModel = mongoose.model<Comment & Document>(
  "Comment",
  CommentSchema
);

export { CommentModel as default, Comment };
