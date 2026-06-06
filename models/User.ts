import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  language: "en" | "am";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  language: { type: String, enum: ["en", "am"], default: "en" },
  createdAt: { type: Date, default: Date.now },
});

const User =
  (mongoose.models.User as Model<IUser> | undefined) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
