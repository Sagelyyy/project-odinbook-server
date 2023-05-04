import mongoose from "mongoose";
import { FacebookUser } from "./user.interface";

const FacebookUserSchema = new mongoose.Schema<FacebookUser>({
  facebookId: {
    type: String,
    unique: true,
  },
  displayName: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    sparse: true, // This allows multiple documents with a null or undefined email field
  },
  profilePictureUrl: String,
});

const FacebookUserModel = mongoose.model<FacebookUser>(
  "FacebookUser",
  FacebookUserSchema
);

export { FacebookUserModel as default, FacebookUser };
