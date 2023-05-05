import express from "express";
import { body, validationResult } from "express-validator";
import Post from "../models/Post";

export const post_get = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO post get" });
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

export const post_update = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO post update" });
};

export const post_delete = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "TODO post delete" });
};
