import express from "express";
import * as authController from "../controllers/authController";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.json({ message: `Welcome ${req.user.firstName}` });
    return;
  }
  res.json({ message: "Odinbook API" });
});

router.get("/auth/facebook", authController.auth_facebook);

router.get("/auth/facebook/callback", authController.auth_facebook_cb);

router.get("/auth/error", authController.facebook_error);

export { router };
