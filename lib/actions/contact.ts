"use server";

import { sendAdminEmail } from "@/lib/email";
import { ContactInquiryEmail } from "@/emails/contact-inquiry";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  const { name, email, subject, message } = data;

  if (!name || name.trim().length < 2) {
    throw new Error("Please enter your name");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!subject || subject.trim().length === 0) {
    throw new Error("Please select a subject");
  }

  if (!message || message.trim().length < 10) {
    throw new Error("Message must be at least 10 characters");
  }

  await sendAdminEmail({
    subject: `Contact Inquiry: ${subject}`,
    react: ContactInquiryEmail({
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
    }),
  });

  return { success: true };
}
