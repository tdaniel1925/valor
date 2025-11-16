// Email sending service
// Uses Resend by default, can be switched to other providers

import { sendEmail as sendEmailResend } from "./resend-sender"

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export async function sendEmail(
  options: EmailOptions
): Promise<{ success: boolean; error?: string }> {
  // Use Resend if configured, otherwise log (for development)
  if (process.env.RESEND_API_KEY) {
    return sendEmailResend({
      to: options.to,
      subject: options.subject,
      template: "custom",
      data: { html: options.html, text: options.text || "" },
      from: options.from,
      replyTo: options.replyTo,
    })
  }

  // Development fallback
  if (process.env.NODE_ENV === "development") {
    console.log("Email would be sent:", {
      to: options.to,
      subject: options.subject,
    })
    return { success: true }
  }

  return {
    success: false,
    error: "Email service not configured. Set RESEND_API_KEY environment variable.",
  }
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; errors?: string[] }> {
  const errors: string[] = []

  for (const recipient of recipients) {
    const result = await sendEmail({
      to: recipient,
      subject,
      html,
      text,
    })
    if (!result.success && result.error) {
      errors.push(`${recipient}: ${result.error}`)
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}
