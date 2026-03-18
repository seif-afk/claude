import { config } from "../config";

const BASE_URL = "https://api.close.com/api/v1";

async function closeApi(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const auth = Buffer.from(`${config.closeApiKey}:`).toString("base64");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Close API ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Lead management ──

export async function searchLeadByEmail(
  email: string
): Promise<{ id: string; contacts: any[] } | null> {
  const data = await closeApi(
    `/lead/?query=email:${encodeURIComponent(email)}&_limit=1`
  );
  if (data.data && data.data.length > 0) {
    return data.data[0];
  }
  return null;
}

export async function createLead(params: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}): Promise<any> {
  const contact: any = {
    name: params.name,
    emails: [{ email: params.email, type: "office" }],
  };
  if (params.phone) {
    contact.phones = [{ phone: params.phone, type: "office" }];
  }

  return closeApi("/lead/", {
    method: "POST",
    body: JSON.stringify({
      name: params.company || params.name,
      contacts: [contact],
    }),
  });
}

export async function upsertLead(bookingData: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}): Promise<{ leadId: string; contactId: string; isNew: boolean }> {
  const existing = await searchLeadByEmail(bookingData.email);

  if (existing) {
    const contactId = existing.contacts?.[0]?.id || "";
    console.log(`Found existing lead ${existing.id}`);
    return { leadId: existing.id, contactId, isNew: false };
  }

  const newLead = await createLead(bookingData);
  const contactId = newLead.contacts?.[0]?.id || "";
  console.log(`Created new lead ${newLead.id}`);
  return { leadId: newLead.id, contactId, isNew: true };
}

// ── Opportunity management ──

export async function getOpportunityStatusId(
  label: string
): Promise<string | null> {
  const data = await closeApi("/status/opportunity/");
  const status = data.data?.find(
    (s: any) => s.label.toLowerCase() === label.toLowerCase()
  );
  return status?.id || null;
}

export async function createOpportunity(params: {
  leadId: string;
  contactId: string;
  note?: string;
}): Promise<any> {
  const statusId = await getOpportunityStatusId("Meeting Booked");
  if (!statusId) {
    throw new Error(
      'Close CRM opportunity status "Meeting Booked" not found. Please create it in Close CRM settings.'
    );
  }

  return closeApi("/opportunity/", {
    method: "POST",
    body: JSON.stringify({
      lead_id: params.leadId,
      contact_id: params.contactId,
      status_id: statusId,
      note: params.note || "Meeting booked via cal.com automation",
    }),
  });
}

// ── Email sending via Close CRM ──

export async function sendCloseEmail(params: {
  leadId: string;
  contactId: string;
  to: string;
  subject: string;
  bodyHtml: string;
  threadId?: string;
}): Promise<{ id: string; thread_id: string }> {
  const payload: any = {
    lead_id: params.leadId,
    contact_id: params.contactId,
    direction: "outgoing",
    status: "outbox",
    subject: params.subject,
    body_html: params.bodyHtml,
    to: [params.to],
    sender: config.closeSenderEmail,
  };

  if (params.threadId) {
    payload.thread_id = params.threadId;
  }

  const result = await closeApi("/activity/email/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return { id: result.id, thread_id: result.thread_id };
}
