// Email delivery service
// This is a placeholder - in production, use a service like SendGrid, Resend, or AWS SES

export interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Placeholder implementation
  // In production, integrate with an email service:
  // - Resend (recommended for Next.js)
  // - SendGrid
  // - AWS SES
  // - Postmark
  
  console.log("Email would be sent:", {
    to: options.to,
    subject: options.subject,
  })
  
  // For now, just log - implement actual email sending
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@valorfinancial.com',
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html,
  //   attachments: options.attachments,
  // })
}

export async function sendQuoteEmail(
  recipientEmail: string,
  quoteNumber: string,
  pdfUrl: string
): Promise<void> {
  const html = `
    <html>
      <body>
        <h1>Your Insurance Quote</h1>
        <p>Thank you for requesting a quote. Please find your quote attached.</p>
        <p>Quote Number: ${quoteNumber}</p>
        <p><a href="${pdfUrl}">Download Quote PDF</a></p>
      </body>
    </html>
  `
  
  await sendEmail({
    to: recipientEmail,
    subject: `Your Insurance Quote - ${quoteNumber}`,
    html,
  })
}

