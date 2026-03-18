import express from "express";
import { config } from "./config";
import {
  handleBookingCreated,
  verifyCalWebhookSignature,
} from "./handlers/booking";
import { startScheduler } from "./services/scheduler";

const app = express();

// Parse JSON body but also keep raw body for signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Cal.com webhook endpoint
app.post("/webhook/cal", async (req: any, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers["x-cal-signature-256"] as string | undefined;
    if (!verifyCalWebhookSignature(req.rawBody || "", signature)) {
      console.warn("Invalid webhook signature");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const { triggerEvent } = req.body;

    if (triggerEvent !== "BOOKING_CREATED") {
      console.log(`Ignoring event: ${triggerEvent}`);
      res.json({ status: "ignored", event: triggerEvent });
      return;
    }

    const result = await handleBookingCreated(req.body);
    console.log(`Webhook processed: ${result.message}`);
    res.json(result);
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server + scheduler
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Webhook URL: POST http://localhost:${config.port}/webhook/cal`);
  startScheduler();
});
