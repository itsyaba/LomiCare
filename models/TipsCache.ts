import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITipsCache extends Document {
  userId: string;
  language: "en" | "am";
  tips: {
    category: string;
    title: string;
    body: string;
    emoji: string;
  }[];
  expiresAt: Date;
  updatedAt: Date;
}

const TipsCacheSchema = new Schema<ITipsCache>({
  userId: { type: String, required: true, index: true },
  language: { type: String, enum: ["en", "am"], required: true },
  tips: { type: [Object], default: [] },
  expiresAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now },
});

TipsCacheSchema.index({ userId: 1, language: 1 }, { unique: true });

const TipsCache =
  (mongoose.models.TipsCache as Model<ITipsCache> | undefined) ||
  mongoose.model<ITipsCache>("TipsCache", TipsCacheSchema);

export default TipsCache;
