import { Router } from "express";
import { router as authRouter } from "./routes/auth";
import { router as postRouter } from "./routes/posts";
import { router as commentRouter } from "./routes/comments";

const router = Router();

router.use("/", authRouter);
router.use("/api/", postRouter);
router.use("/api/", commentRouter);

export default router;
