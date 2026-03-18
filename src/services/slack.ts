import { config } from "../config";

const SLACK_API = "https://slack.com/api/chat.postMessage";

export interface BookingDetails {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  eventTitle: string;
  meetingTime?: string;
  timezone?: string;
  isNewLead: boolean;
}

export async function sendBookingNotification(
  details: BookingDetails
): Promise<void> {
  const leadStatus = details.isNewLead ? "🆕 New Lead" : "🔄 Existing Lead";

  const fields: string[] = [
    `*Name:* ${details.name}`,
    `*Email:* ${details.email}`,
  ];
  if (details.company) fields.push(`*Company:* ${details.company}`);
  if (details.phone) fields.push(`*Phone:* ${details.phone}`);
  if (details.meetingTime) fields.push(`*Meeting:* ${details.meetingTime}`);
  if (details.timezone) fields.push(`*Timezone:* ${details.timezone}`);

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📅 New Sales Meeting Booked",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: fields.join("\n"),
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `${leadStatus} · ${details.eventTitle} · Status set to *Meeting Booked* in Close CRM`,
        },
      ],
    },
    { type: "divider" },
  ];

  const res = await fetch(SLACK_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.slackBotToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: config.slackChannel,
      text: `New meeting booked: ${details.name} (${details.email})`,
      blocks,
    }),
  });

  const data = await res.json() as any;
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }
  console.log(`Slack notification sent for ${details.email}`);
}
