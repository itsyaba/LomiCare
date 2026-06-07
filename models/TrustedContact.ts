import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITrustedContact extends Document {
  userId: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  preferredMethod: "sms" | "email" | "copy";
  createdAt: Date;
}

const TrustedContactSchema = new Schema<ITrustedContact>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  preferredMethod: {
    type: String,
    enum: ["sms", "email", "copy"],
    default: "copy",
  },
  createdAt: { type: Date, default: Date.now },
});

TrustedContactSchema.index({ userId: 1, createdAt: -1 });

const TrustedContact =
  (mongoose.models.TrustedContact as Model<ITrustedContact> | undefined) ||
  mongoose.model<ITrustedContact>("TrustedContact", TrustedContactSchema);

export default TrustedContact;
