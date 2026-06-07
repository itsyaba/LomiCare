import mongoose, { Schema, type Document, type Model } from "mongoose";

export type RetreatPlan = {
  arrivalReset: string;
  activity: string;
  foodReminder: string;
  reflectionPrompt: string;
  eveningCheckIn: string;
};

export interface IRetreatSession extends Document {
  userId?: string;
  anonymousSessionId: string;
  arrivalMood: number;
  arrivalStress: number;
  arrivalEnergy: number;
  intention: string;
  plan: RetreatPlan;
  eveningMood?: number;
  eveningStress?: number;
  reflection?: string;
  aiSummary?: string;
  createdAt: Date;
  completedAt?: Date;
}

const RetreatSessionSchema = new Schema<IRetreatSession>({
  userId: { type: String, index: true },
  anonymousSessionId: { type: String, required: true, index: true },
  arrivalMood: { type: Number, required: true, min: 1, max: 10 },
  arrivalStress: { type: Number, required: true, min: 1, max: 5 },
  arrivalEnergy: { type: Number, required: true, min: 1, max: 5 },
  intention: { type: String, required: true },
  plan: {
    arrivalReset: { type: String, required: true },
    activity: { type: String, required: true },
    foodReminder: { type: String, required: true },
    reflectionPrompt: { type: String, required: true },
    eveningCheckIn: { type: String, required: true },
  },
  eveningMood: { type: Number, min: 1, max: 10 },
  eveningStress: { type: Number, min: 1, max: 5 },
  reflection: { type: String },
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

RetreatSessionSchema.index({ anonymousSessionId: 1, createdAt: -1 });

const RetreatSession =
  (mongoose.models.RetreatSession as Model<IRetreatSession> | undefined) ||
  mongoose.model<IRetreatSession>("RetreatSession", RetreatSessionSchema);

export default RetreatSession;
