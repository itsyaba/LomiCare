import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IChatMessage extends Document {
  userId: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  language: "en" | "am";
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  language: { type: String, enum: ["en", "am"], default: "en" },
  createdAt: { type: Date, default: Date.now },
});

ChatMessageSchema.index({ userId: 1, sessionId: 1, createdAt: 1 });

const ChatMessage =
  (mongoose.models.ChatMessage as Model<IChatMessage> | undefined) ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;
