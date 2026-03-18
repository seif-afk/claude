import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  calWebhookSecret: process.env.CAL_WEBHOOK_SECRET || "",
  calEventTypeName: process.env.CAL_EVENT_TYPE_NAME || "⚡ AI Outbound Demo",
  closeApiKey: process.env.CLOSE_API_KEY || "",
  closeSenderEmail: process.env.CLOSE_SENDER_EMAIL || "seif@netswick.com",
  closeSenderName: process.env.CLOSE_SENDER_NAME || "Seif Khalil",
  email1DelayMs: 5 * 60 * 1000, // 5 minutes
  email2DelayMs: 2 * 60 * 60 * 1000, // 2 hours
};
