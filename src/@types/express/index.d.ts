import { Express } from "express-serve-static-core";
import { FacebookUser } from "../../models/user.interface";

declare module "express-serve-static-core" {
  interface Request {
    user: FacebookUser;
  }
}
