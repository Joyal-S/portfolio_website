import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendContactNotificationParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactNotification({
  name,
  email,
  message,
}: SendContactNotificationParams) {
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!contactEmail || !process.env.RESEND_API_KEY) {
    return;
  }

  try {
    await resend.emails.send({
      from: `Portfolio <onboarding@resend.dev>`,
      to: contactEmail,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch {
    console.warn("Failed to send email notification");
  }
}
