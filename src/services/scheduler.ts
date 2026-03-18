import Database from "better-sqlite3";
import path from "path";
import { sendCloseEmail } from "./close-crm";
import { getEmail1Html, getEmail2Html, EMAIL_1_SUBJECT } from "../templates/emails";

const DB_PATH = path.join(process.cwd(), "jobs.db");

let db: Database.Database;

export function initScheduler(): void {
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS scheduled_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      booking_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      run_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      thread_id TEXT,
      error TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_jobs_pending
    ON scheduled_jobs (status, run_at)
    WHERE status = 'pending'
  `);
}

export interface JobPayload {
  leadId: string;
  contactId: string;
  email: string;
  firstName: string;
}

export function scheduleEmail(
  type: "email_1" | "email_2",
  bookingId: string,
  payload: JobPayload,
  delayMs: number
): void {
  const runAt = Math.floor((Date.now() + delayMs) / 1000);
  db.prepare(
    `INSERT INTO scheduled_jobs (type, booking_id, payload, run_at)
     VALUES (?, ?, ?, ?)`
  ).run(type, bookingId, JSON.stringify(payload), runAt);
  console.log(`Scheduled ${type} for ${payload.email} at ${new Date(runAt * 1000).toISOString()}`);
}

async function processEmail1(job: any, payload: JobPayload): Promise<void> {
  const html = getEmail1Html(payload.firstName);
  const result = await sendCloseEmail({
    leadId: payload.leadId,
    contactId: payload.contactId,
    to: payload.email,
    subject: EMAIL_1_SUBJECT,
    bodyHtml: html,
  });

  // Store thread_id on the matching email_2 job so it can reply in-thread
  db.prepare(
    `UPDATE scheduled_jobs SET thread_id = ?
     WHERE booking_id = ? AND type = 'email_2' AND status = 'pending'`
  ).run(result.thread_id, job.booking_id);

  console.log(`Email 1 sent to ${payload.email}, thread: ${result.thread_id}`);
}

async function processEmail2(job: any, payload: JobPayload): Promise<void> {
  const html = getEmail2Html(payload.firstName);
  await sendCloseEmail({
    leadId: payload.leadId,
    contactId: payload.contactId,
    to: payload.email,
    subject: `Re: ${EMAIL_1_SUBJECT}`,
    bodyHtml: html,
    threadId: job.thread_id || undefined,
  });
  console.log(`Email 2 (reply) sent to ${payload.email}`);
}

export async function processJobs(): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const pendingJobs = db
    .prepare(
      `SELECT * FROM scheduled_jobs
       WHERE status = 'pending' AND run_at <= ?
       ORDER BY run_at ASC`
    )
    .all(now) as any[];

  for (const job of pendingJobs) {
    const payload: JobPayload = JSON.parse(job.payload);
    try {
      if (job.type === "email_1") {
        await processEmail1(job, payload);
      } else if (job.type === "email_2") {
        await processEmail2(job, payload);
      }
      db.prepare(`UPDATE scheduled_jobs SET status = 'completed' WHERE id = ?`).run(
        job.id
      );
    } catch (err: any) {
      console.error(`Job ${job.id} (${job.type}) failed:`, err.message);
      db.prepare(
        `UPDATE scheduled_jobs SET status = 'failed', error = ? WHERE id = ?`
      ).run(err.message, job.id);
    }
  }
}

let pollInterval: NodeJS.Timeout | null = null;

export function startScheduler(): void {
  initScheduler();
  console.log("Job scheduler started (polling every 30s)");
  pollInterval = setInterval(async () => {
    try {
      await processJobs();
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  }, 30_000);
  // Run once immediately on start to pick up any pending jobs
  processJobs().catch(console.error);
}

export function stopScheduler(): void {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}
