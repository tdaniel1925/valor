// Email template utilities
// These templates can be used with email services like SendGrid, Resend, etc.

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Gets email template by name
 */
export function getEmailTemplate(
  templateName: string,
  data: Record<string, any>
): { html: string; text: string } {
  switch (templateName) {
    case "welcome":
      return {
        html: getWelcomeTemplate(data.name || "User"),
        text: `Welcome ${data.name || "User"}!`,
      }
    case "caseStatusUpdate":
      return {
        html: getCaseStatusUpdateTemplate(
          data.caseNumber || "",
          data.status || "",
          data.caseUrl || ""
        ),
        text: `Case ${data.caseNumber} status updated to ${data.status}`,
      }
    case "quoteReady":
      return {
        html: getQuoteReadyTemplate(
          data.quoteNumber || "",
          data.quoteUrl || ""
        ),
        text: `Quote ${data.quoteNumber} is ready`,
      }
    case "custom":
      return {
        html: data.html || "",
        text: data.text || "",
      }
    default:
      return {
        html: "<p>Email content</p>",
        text: "Email content",
      }
  }
}

function getWelcomeTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Valor Insurance Platform</h2>
      <p>Hi ${name},</p>
      <p>Welcome to Valor Financial Specialists! We're excited to have you on board.</p>
      <p>You can now access your dashboard and start managing your insurance cases and quotes.</p>
    </div>
  `
}

function getCaseStatusUpdateTemplate(
  caseNumber: string,
  status: string,
  caseUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Case Status Update</h2>
      <p>Case ${caseNumber} status has been updated to: <strong>${status}</strong></p>
      <p><a href="${caseUrl}">View Case</a></p>
    </div>
  `
}

function getQuoteReadyTemplate(quoteNumber: string, quoteUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Quote is Ready</h2>
      <p>Quote ${quoteNumber} has been generated and is ready for review.</p>
      <p><a href="${quoteUrl}">View Quote</a></p>
    </div>
  `
}

export function getCaseCreatedTemplate(
  caseNumber: string,
  clientName: string,
  agentName: string
): EmailTemplate {
  return {
    subject: `New Case Created: ${caseNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Case Created</h2>
        <p>A new case has been created:</p>
        <ul>
          <li><strong>Case Number:</strong> ${caseNumber}</li>
          <li><strong>Client:</strong> ${clientName}</li>
          <li><strong>Agent:</strong> ${agentName}</li>
        </ul>
        <p>You can view the case in your dashboard.</p>
      </div>
    `,
    text: `New Case Created\n\nCase Number: ${caseNumber}\nClient: ${clientName}\nAgent: ${agentName}`,
  }
}

export function getCaseStatusChangedTemplate(
  caseNumber: string,
  oldStatus: string,
  newStatus: string,
  clientName: string
): EmailTemplate {
  return {
    subject: `Case Status Updated: ${caseNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Case Status Updated</h2>
        <p>The status of case <strong>${caseNumber}</strong> for client <strong>${clientName}</strong> has been updated:</p>
        <p><strong>Previous Status:</strong> ${oldStatus}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p>You can view the case in your dashboard.</p>
      </div>
    `,
    text: `Case Status Updated\n\nCase: ${caseNumber}\nClient: ${clientName}\nPrevious Status: ${oldStatus}\nNew Status: ${newStatus}`,
  }
}

export function getQuoteCreatedTemplate(
  quoteNumber: string,
  clientName: string,
  quoteType: string
): EmailTemplate {
  return {
    subject: `New Quote Created: ${quoteNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Quote Created</h2>
        <p>A new ${quoteType} quote has been created:</p>
        <ul>
          <li><strong>Quote Number:</strong> ${quoteNumber}</li>
          <li><strong>Client:</strong> ${clientName}</li>
          <li><strong>Type:</strong> ${quoteType}</li>
        </ul>
        <p>You can view the quote in your dashboard.</p>
      </div>
    `,
    text: `New Quote Created\n\nQuote Number: ${quoteNumber}\nClient: ${clientName}\nType: ${quoteType}`,
  }
}

export function getCommissionPaidTemplate(
  amount: number,
  period: string
): EmailTemplate {
  return {
    subject: `Commission Paid: $${amount.toFixed(2)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Commission Paid</h2>
        <p>Your commission has been paid:</p>
        <ul>
          <li><strong>Amount:</strong> $${amount.toFixed(2)}</li>
          <li><strong>Period:</strong> ${period}</li>
        </ul>
        <p>You can view your commission statement in your dashboard.</p>
      </div>
    `,
    text: `Commission Paid\n\nAmount: $${amount.toFixed(2)}\nPeriod: ${period}`,
  }
}

