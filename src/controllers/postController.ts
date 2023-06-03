import express from "express";
import { body, validationResult } from "express-validator";
import Post from "../models/Post";

export const post_get = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    Post.find()
      .populate("userId")
      .sort({ createdAt: "descending" })
      .then((post) => {
        res.json({ message: "success", post });
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

export const post_post = [
  body("content", "Post invalid").not().isEmpty().trim().escape(),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
      const errors = validationResult(req);
      let errorMessages = validationResult(req).array();
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errorMessages });
        return;
      }
      const newPost = new Post({
        content: req.body.content,
        userId: req.user.id,
      })
        .save()
        .then((savedPost) => {
          res.json({ message: "success", savedPost });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "Error", err });
        });
    } else {
      res.sendStatus(403);
    }
  },
];

export const post_detail = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO post detail" });
};

export const post_update = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const updateFields: any = {};
      if ("content" in req.body) {
        updateFields.content = req.body.content;
      }

      if ("likes" in req.body) {
        if (post.likedBy.includes(userId)) {
          updateFields.$inc = { likeCount: -1 };
          updateFields.$pull = { likedBy: req.user._id };
        } else {
          updateFields.$inc = { likeCount: 1 };
          updateFields.$push = { likedBy: req.user._id };
        }
      }

      const updatedPost = await Post.findByIdAndUpdate(postId, updateFields, {
        new: true,
      });
      res.json({ message: "success", post: updatedPost });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error", err });
    }
  } else {
    res.sendStatus(403);
  }
};

export const post_delete = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO post delete" });
};
