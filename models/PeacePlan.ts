import mongoose, { Schema, type Document, type Model } from "mongoose";

export type PeacePlanDay = {
  dayNumber: number;
  theme: string;
  action: string;
  reflectionPrompt: string;
  completed: boolean;
};

export interface IPeacePlan extends Document {
  userId: string;
  title: string;
  days: PeacePlanDay[];
  language: "en" | "am";
  createdAt: Date;
  updatedAt: Date;
}

const PeacePlanDaySchema = new Schema<PeacePlanDay>(
  {
    dayNumber: { type: Number, required: true, min: 1, max: 7 },
    theme: { type: String, required: true },
    action: { type: String, required: true },
    reflectionPrompt: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false },
);

const PeacePlanSchema = new Schema<IPeacePlan>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    days: { type: [PeacePlanDaySchema], default: [] },
    language: { type: String, enum: ["en", "am"], default: "en" },
  },
  { timestamps: true },
);

PeacePlanSchema.index({ userId: 1, createdAt: -1 });

const PeacePlan =
  (mongoose.models.PeacePlan as Model<IPeacePlan> | undefined) ||
  mongoose.model<IPeacePlan>("PeacePlan", PeacePlanSchema);

export default PeacePlan;
