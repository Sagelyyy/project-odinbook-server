import express from "express";
import * as postController from "../controllers/postController";

const router = express.Router();

router.get("/posts", postController.post_get);

router.post("/posts", postController.post_post);

router.get("/posts/:id", postController.post_detail);

router.put("/posts/:id", postController.post_update);

router.delete("/posts/:id", postController.post_delete);

export { router };
