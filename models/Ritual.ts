import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IRitual extends Document {
  userId: string;
  checkInId?: string;
  title: string;
  explanation: string;
  durationMinutes: number;
  steps: string[];
  culturalTag: string;
  language: "en" | "am";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RitualSchema = new Schema<IRitual>(
  {
    userId: { type: String, required: true, index: true },
    checkInId: { type: String, index: true },
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 120 },
    steps: { type: [String], required: true },
    culturalTag: { type: String, required: true },
    language: { type: String, enum: ["en", "am"], default: "en" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

RitualSchema.index({ userId: 1, createdAt: -1 });

const Ritual =
  (mongoose.models.Ritual as Model<IRitual> | undefined) ||
  mongoose.model<IRitual>("Ritual", RitualSchema);

export default Ritual;
