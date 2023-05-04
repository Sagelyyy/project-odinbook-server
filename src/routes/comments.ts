import express from "express";
import * as commentController from "../controllers/commentController";

const router = express.Router();

router.get("/comments", commentController.comment_get);

router.get("/posts/:id/comments", commentController.post_comment_get);

router.post("/posts/:id/comments", commentController.comment_post);

router.get("/comments/:id", commentController.comment_detail);

router.put("/comments/:id", commentController.comment_update);

router.delete("/comments/:id", commentController.comment_delete);

export { router };
