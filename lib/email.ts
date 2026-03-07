import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/** Resend error shape – message and optional code/status */
interface ResendError {
  message?: string;
  name?: string;
  statusCode?: number;
  [key: string]: unknown;
}

const isProduction =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

/**
 * Returns the "from" address for outgoing contact emails.
 * - RESEND_FROM_EMAIL: use if set (e.g. onboarding@resend.dev before domain verification)
 * - Otherwise: Innovexle Contact <noreply@{domain}>
 */
function getFromAddress(): string {
  const custom = process.env.RESEND_FROM_EMAIL?.trim();
  if (custom) {
    return custom.includes("<")
      ? custom
      : `Innovexle Contact <${custom}>`;
  }
  const domain = getDomain();
  return `Innovexle Contact <noreply@${domain}>`;
}

export async function sendContactEmail(data: ContactEmailPayload) {
  const recipient = process.env.CONTACT_EMAIL || "hello@innovexle.com";

  if (!resend) {
    if (isProduction) {
      throw new Error(
        "Contact form is not configured. Add RESEND_API_KEY to Vercel environment variables. See .env.example and CONTACT_SETUP.md."
      );
    }
    console.log("[Email] Resend not configured - logging submission:", {
      to: recipient,
      from: data.email,
      name: data.name,
      company: data.company,
      preview: data.message.slice(0, 120),
    });
    return { success: true };
  }

  const from = getFromAddress();
  const payload = {
    from,
    replyTo: data.email,
    to: [recipient],
    subject: `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    text: formatPlainText(data),
    html: formatHtml(data),
  };

  const { data: sendData, error } = await resend.emails.send(payload);

  if (error) {
    const err = error as ResendError;
    const message = typeof err?.message === "string" ? err.message : "Unknown error";
    const code = err?.statusCode ?? err?.name ?? "unknown";
    console.error("[Email] Send failed:", {
      code,
      message,
      from,
      to: recipient,
      resendError: JSON.stringify(err, null, 2),
    });
    throw new EmailSendError(message, code);
  }

  if (sendData?.id) {
    console.log("[Email] Sent successfully:", { id: sendData.id, to: recipient });
  }

  return { success: true };
}

/** Thrown when Resend API returns an error – preserves cause for logging */
export class EmailSendError extends Error {
  constructor(
    message: string,
    public readonly code?: string | number
  ) {
    super(message);
    this.name = "EmailSendError";
  }
}

function getDomain(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://innovexle.com";
  try {
    return new URL(url).hostname;
  } catch {
    return "innovexle.com";
  }
}

function formatPlainText(data: ContactEmailPayload): string {
  return [
    `New contact form submission`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    ``,
    `Message:`,
    data.message,
    ``,
    `---`,
    `Sent from innovexle.com contact form`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatHtml(data: ContactEmailPayload): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #171717; margin-bottom: 24px;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #737373; font-size: 14px; width: 100px;">Name</td>
          <td style="padding: 8px 0; color: #171717;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #737373; font-size: 14px;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #0d9488;">${escapeHtml(data.email)}</a></td>
        </tr>
        ${
          data.company
            ? `<tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #171717;">${escapeHtml(data.company)}</td></tr>`
            : ""
        }
      </table>
      <div style="margin-top: 24px; padding: 16px; background: #FAFAFA; border-radius: 8px; border: 1px solid #E5E5E5;">
        <p style="margin: 0 0 8px; color: #737373; font-size: 14px;">Message</p>
        <p style="margin: 0; color: #171717; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <p style="margin-top: 24px; color: #A3A3A3; font-size: 12px;">Sent from innovexle.com contact form</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
