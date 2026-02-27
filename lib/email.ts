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

export async function sendContactEmail(data: ContactEmailPayload) {
  const recipient = process.env.CONTACT_EMAIL || "hello@innovexle.com";

  if (!resend) {
    console.log("[Email] Resend not configured - logging submission:", {
      to: recipient,
      from: data.email,
      name: data.name,
      company: data.company,
      preview: data.message.slice(0, 120),
    });
    return { success: true };
  }

  const { error } = await resend.emails.send({
    from: `Innovexle Contact <noreply@${getDomain()}>`,
    replyTo: data.email,
    to: [recipient],
    subject: `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    text: formatPlainText(data),
    html: formatHtml(data),
  });

  if (error) {
    console.error("[Email] Send failed:", error);
    throw new Error("Failed to send email");
  }

  return { success: true };
}

function getDomain() {
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
