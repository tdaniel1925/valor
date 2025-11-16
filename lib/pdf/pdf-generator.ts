// PDF generation service - DISABLED
// Puppeteer has been removed to fix build issues
// To enable: npm install puppeteer @sparticuz/chromium
// For serverless, use: https://github.com/Sparticuz/chromium

// import puppeteer from "puppeteer"

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
 * CURRENTLY DISABLED - Puppeteer not installed
 */
export async function generatePDFFromHTML(
  html: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  throw new Error("PDF generation is currently disabled. Install puppeteer to enable.")
}

/**
 * Generates PDF from URL
 * CURRENTLY DISABLED - Puppeteer not installed
 */
export async function generatePDFFromURL(
  url: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  throw new Error("PDF generation is currently disabled. Install puppeteer to enable.")
}

/**
 * Generates quote PDF
 * CURRENTLY DISABLED - Puppeteer not installed
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
  throw new Error("PDF generation is currently disabled. Install puppeteer to enable.")
}

/**
 * Generates case PDF
 * CURRENTLY DISABLED - Puppeteer not installed
 */
export async function generateCasePDF(caseData: {
  caseNumber: string
  clientName: string
  status: string
  carrier: string
  product: string
  submittedAt: string
}): Promise<Buffer> {
  throw new Error("PDF generation is currently disabled. Install puppeteer to enable.")
}

