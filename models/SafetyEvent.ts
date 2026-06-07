import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISafetyEvent extends Document {
  userId: string;
  source: "chat" | "checkin" | "voice" | "ritual";
  riskLevel: "none" | "low" | "medium" | "high";
  categories: string[];
  excerpt: string;
  createdAt: Date;
}

const SafetyEventSchema = new Schema<ISafetyEvent>({
  userId: { type: String, required: true, index: true },
  source: {
    type: String,
    enum: ["chat", "checkin", "voice", "ritual"],
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ["none", "low", "medium", "high"],
    required: true,
  },
  categories: { type: [String], default: [] },
  excerpt: { type: String, required: true, maxlength: 240 },
  createdAt: { type: Date, default: Date.now },
});

SafetyEventSchema.index({ userId: 1, createdAt: -1 });

const SafetyEvent =
  (mongoose.models.SafetyEvent as Model<ISafetyEvent> | undefined) ||
  mongoose.model<ISafetyEvent>("SafetyEvent", SafetyEventSchema);

export default SafetyEvent;
