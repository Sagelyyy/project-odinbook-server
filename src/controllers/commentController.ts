import express from "express";
import { body, validationResult } from "express-validator";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const comment_get = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    Comment.find()
      .populate("userId")
      .populate("FacebookUser")
      .then((comment) => {
        res.json({ message: "success", comment });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "Error", err });
        return next(err);
      });
  } else {
    res.status(403).json({ message: "Not authenticated" });
  }
};

export const post_comment_get = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    Comment.find({ postId: req.params.id })
      .populate("postId")
      .populate("userId")
      .then((comments) => {
        res.json({ message: "success", comments });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(403).json({ message: "Not authenticated" });
  }
};

export const comment_post = [
  body("content", "Post invalid")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isLength({ max: 2500 }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.isAuthenticated()) {
      const errors = validationResult(req);
      let messages = validationResult(req).array();
      if (!errors.isEmpty()) {
        res.status(400).json({ message: messages });
        return;
      }
      try {
        const newComment = new Comment({
          content: req.body.content,
          userId: req.user._id,
          postId: req.params.id,
        });

        const savedComment = await newComment.save();

        await Post.updateOne(
          { _id: req.params.id },
          { $inc: { commentCount: 1 } }
        );

        res.json({ message: "success", comment: savedComment });
      } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error", err });
      }
    } else {
      res.sendStatus(403);
    }
  },
];

export const comment_detail = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO comment detail" });
};

export const comment_update = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO comment update" });
};

export const comment_delete = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO comment delete" });
};
