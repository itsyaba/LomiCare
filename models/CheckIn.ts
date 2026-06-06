import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICheckIn extends Document {
  userId: string;
  date: Date;
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
  note: string;
  aiInsight: string;
  language: "en" | "am";
}

const CheckInSchema = new Schema<ICheckIn>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  mood: { type: Number, required: true, min: 1, max: 10 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  sleep: { type: Number, required: true, min: 0, max: 12 },
  stress: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, default: "" },
  aiInsight: { type: String, default: "" },
  language: { type: String, enum: ["en", "am"], default: "en" },
});

CheckInSchema.index({ userId: 1, date: -1 });

const CheckIn =
  (mongoose.models.CheckIn as Model<ICheckIn> | undefined) ||
  mongoose.model<ICheckIn>("CheckIn", CheckInSchema);

export default CheckIn;
