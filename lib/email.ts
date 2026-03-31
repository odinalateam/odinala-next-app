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

/**
 * Fire-and-forget email sender.
 * Errors are logged silently so email failures never break application flow.
 */
export function sendEmail({ to, subject, react }: SendEmailOptions): void {
  const client = getResend();
  if (!client) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return;
  }

  client.emails
    .send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    })
    .then((result) => {
      if (result.error) {
        console.error("[Email Error]", result.error);
      }
    })
    .catch((error) => {
      console.error("[Email Send Failed]", error);
    });
}

export function sendAdminEmail({
  subject,
  react,
}: Omit<SendEmailOptions, "to">): void {
  sendEmail({ to: ADMIN_EMAIL, subject, react });
}
