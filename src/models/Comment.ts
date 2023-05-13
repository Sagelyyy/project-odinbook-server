import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";
import { DateTime } from "luxon";

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post",
      required: true,
    },
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
      maxlength: 2500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CommentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("MM-dd-yyyy, hh:mm a");
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
