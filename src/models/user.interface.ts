import { Document } from "mongoose";

export interface FacebookUser extends Document {
  facebookId: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePictureUrl?: string;
}
