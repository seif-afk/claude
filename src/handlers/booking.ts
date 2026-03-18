import { config } from "../config";
import { upsertLeadWithMeetingBooked } from "../services/close-crm";
import { scheduleEmail, JobPayload } from "../services/scheduler";
import crypto from "crypto";

interface CalBookingPayload {
  triggerEvent: string;
  payload: {
    uid: string;
    title: string;
    eventTitle?: string;
    type?: string;
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    responses?: {
      name?: { value: string };
      email?: { value: string };
      company?: { value: string };
      phone?: { value: string };
      [key: string]: any;
    };
    metadata?: {
      [key: string]: any;
    };
  };
}

function extractFirstName(fullName: string): string {
  return fullName.split(" ")[0];
}

function extractBookingData(body: CalBookingPayload) {
  const { payload } = body;
  const attendee = payload.attendees?.[0];

  if (!attendee) {
    throw new Error("No attendee found in booking payload");
  }

  const responses = payload.responses || {};
  const company =
    responses.company?.value ||
    (responses as any)["Company"]?.value ||
    undefined;
  const phone =
    responses.phone?.value ||
    (responses as any)["Phone"]?.value ||
    undefined;

  return {
    bookingId: payload.uid,
    eventTitle: payload.title || payload.eventTitle || "",
    name: attendee.name,
    email: attendee.email,
    firstName: extractFirstName(attendee.name),
    company,
    phone,
  };
}

export function verifyCalWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  if (!config.calWebhookSecret) {
    // If no secret configured, skip verification (development mode)
    console.warn("No CAL_WEBHOOK_SECRET set — skipping signature verification");
    return true;
  }
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", config.calWebhookSecret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function handleBookingCreated(
  body: CalBookingPayload
): Promise<{ success: boolean; message: string }> {
  const data = extractBookingData(body);

  // Filter: only process bookings for the target event type
  if (
    config.calEventTypeName &&
    !data.eventTitle.includes("AI Outbound Demo")
  ) {
    console.log(
      `Skipping booking "${data.eventTitle}" — not an AI Outbound Demo`
    );
    return { success: true, message: "Skipped: not a target event type" };
  }

  console.log(
    `Processing booking for ${data.name} (${data.email}) — "${data.eventTitle}"`
  );

  // Step 1: Upsert lead in Close CRM with "Meeting Booked" status
  const { leadId, contactId, isNew } = await upsertLeadWithMeetingBooked({
    name: data.name,
    email: data.email,
    company: data.company,
    phone: data.phone,
  });

  const jobPayload: JobPayload = {
    leadId,
    contactId,
    email: data.email,
    firstName: data.firstName,
  };

  // Step 2: Schedule Email 1 (5 minutes after booking)
  scheduleEmail("email_1", data.bookingId, jobPayload, config.email1DelayMs);

  // Step 3: Schedule Email 2 (2 hours after booking, will reply in thread)
  scheduleEmail("email_2", data.bookingId, jobPayload, config.email2DelayMs);

  return {
    success: true,
    message: `Lead ${isNew ? "created" : "updated"} (${leadId}). Emails scheduled.`,
  };
}
