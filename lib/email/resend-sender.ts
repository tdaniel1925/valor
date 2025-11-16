// Resend email service implementation
// Install: npm install resend

import { Resend } from "resend"
import { getEmailTemplate } from "./templates"
import { env } from "@/lib/env"

// Initialize Resend client
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured")
    }
    resend = new Resend(apiKey)
  }
  return resend
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: string
  data?: Record<string, any>
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
  }>
}

/**
 * Sends an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const client = getResendClient()
    const fromEmail = options.from || process.env.EMAIL_FROM || "noreply@valorfinancial.com"
    
    // Get email template
    const { html, text } = getEmailTemplate(options.template, options.data || {})

    const result = await client.emails.send({
      from: fromEmail,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: html,
      text: text,
      reply_to: options.replyTo,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        content: typeof att.content === "string" ? Buffer.from(att.content) : att.content,
        content_type: att.contentType,
      })),
    })

    if (result.error) {
      console.error("Resend email error:", result.error)
      return {
        success: false,
        error: result.error.message || "Failed to send email",
      }
    }

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Sends a welcome email
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: "Welcome to Valor Insurance Platform",
    template: "welcome",
    data: { name },
  })
}

/**
 * Sends a case status update email
 */
export async function sendCaseStatusEmail(
  to: string,
  caseNumber: string,
  status: string,
  caseUrl: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: `Case ${caseNumber} Status Update`,
    template: "caseStatusUpdate",
    data: { caseNumber, status, caseUrl },
  })
}

/**
 * Sends a quote email
 */
export async function sendQuoteEmail(
  to: string,
  quoteNumber: string,
  quoteUrl: string,
  pdfUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const attachments = pdfUrl
    ? [
        {
          filename: `quote-${quoteNumber}.pdf`,
          content: pdfUrl, // In production, fetch the PDF content
          contentType: "application/pdf",
        },
      ]
    : undefined

  return sendEmail({
    to,
    subject: `Your Quote ${quoteNumber}`,
    template: "quoteReady",
    data: { quoteNumber, quoteUrl },
    attachments,
  })
}

