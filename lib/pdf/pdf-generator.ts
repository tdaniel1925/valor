// PDF generation service using Puppeteer
// Install: npm install puppeteer
// For production, consider using @sparticuz/chromium for serverless

import puppeteer from "puppeteer"

interface PDFOptions {
  format?: "A4" | "Letter" | "Legal"
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  printBackground?: boolean
  displayHeaderFooter?: boolean
  headerTemplate?: string
  footerTemplate?: string
}

/**
 * Generates PDF from HTML content
 */
export async function generatePDFFromHTML(
  html: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  let browser: puppeteer.Browser | null = null

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    // Set content
    await page.setContent(html, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdf = await page.pdf({
      format: options.format || "A4",
      margin: options.margin || {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: options.printBackground ?? true,
      displayHeaderFooter: options.displayHeaderFooter ?? false,
      headerTemplate: options.headerTemplate,
      footerTemplate: options.footerTemplate,
    })

    return Buffer.from(pdf)
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Generates PDF from URL
 */
export async function generatePDFFromURL(
  url: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  let browser: puppeteer.Browser | null = null

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" })

    const pdf = await page.pdf({
      format: options.format || "A4",
      margin: options.margin || {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: options.printBackground ?? true,
    })

    return Buffer.from(pdf)
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Generates quote PDF
 */
export async function generateQuotePDF(quoteData: {
  quoteNumber: string
  clientName: string
  carrier: string
  product: string
  faceAmount: string
  premium: string
  effectiveDate: string
}): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .quote-info { margin: 20px 0; }
        .quote-info h2 { color: #333; }
        .quote-details { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Valor Financial Specialists</h1>
        <h2>Insurance Quote</h2>
      </div>
      <div class="quote-info">
        <h2>Quote #${quoteData.quoteNumber}</h2>
        <div class="quote-details">
          <div class="detail-row">
            <strong>Client Name:</strong>
            <span>${quoteData.clientName}</span>
          </div>
          <div class="detail-row">
            <strong>Carrier:</strong>
            <span>${quoteData.carrier}</span>
          </div>
          <div class="detail-row">
            <strong>Product:</strong>
            <span>${quoteData.product}</span>
          </div>
          <div class="detail-row">
            <strong>Face Amount:</strong>
            <span>${quoteData.faceAmount}</span>
          </div>
          <div class="detail-row">
            <strong>Premium:</strong>
            <span>${quoteData.premium}</span>
          </div>
          <div class="detail-row">
            <strong>Effective Date:</strong>
            <span>${quoteData.effectiveDate}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>This is a computer-generated quote. Please contact your agent for more information.</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `

  return generatePDFFromHTML(html)
}

/**
 * Generates case PDF
 */
export async function generateCasePDF(caseData: {
  caseNumber: string
  clientName: string
  status: string
  carrier: string
  product: string
  submittedAt: string
}): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .case-info { margin: 20px 0; }
        .case-info h2 { color: #333; }
        .case-details { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .status { padding: 5px 15px; border-radius: 4px; display: inline-block; }
        .status.submitted { background: #3b82f6; color: white; }
        .status.approved { background: #10b981; color: white; }
        .status.rejected { background: #ef4444; color: white; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Valor Financial Specialists</h1>
        <h2>Case Summary</h2>
      </div>
      <div class="case-info">
        <h2>Case #${caseData.caseNumber}</h2>
        <div class="case-details">
          <div class="detail-row">
            <strong>Client Name:</strong>
            <span>${caseData.clientName}</span>
          </div>
          <div class="detail-row">
            <strong>Status:</strong>
            <span class="status ${caseData.status}">${caseData.status}</span>
          </div>
          <div class="detail-row">
            <strong>Carrier:</strong>
            <span>${caseData.carrier}</span>
          </div>
          <div class="detail-row">
            <strong>Product:</strong>
            <span>${caseData.product}</span>
          </div>
          <div class="detail-row">
            <strong>Submitted:</strong>
            <span>${caseData.submittedAt}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `

  return generatePDFFromHTML(html)
}

