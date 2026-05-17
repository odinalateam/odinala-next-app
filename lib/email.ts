import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = "Odinala <noreply@odinala.io>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export { ADMIN_EMAIL, APP_URL };

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions): Promise<void> {
  const client = getResend();
  if (!client) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return;
  }

  const result = await client.emails.send({ from: FROM_EMAIL, to, subject, react });
  if (result.error) {
    console.error("[Email Error]", result.error);
    throw new Error(`Failed to send email: ${result.error.message}`);
  }
}

export async function sendAdminEmail({
  subject,
  react,
}: Omit<SendEmailOptions, "to">): Promise<void> {
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }
  await sendEmail({ to: ADMIN_EMAIL, subject, react });
}
