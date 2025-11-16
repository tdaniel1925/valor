import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatStatus,
} from "@/lib/utils/format"

describe("format utilities", () => {
  describe("formatCurrency", () => {
    it("formats number as currency", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
    })

    it("handles null values", () => {
      expect(formatCurrency(null)).toBe("$0.00")
    })

    it("handles string values", () => {
      expect(formatCurrency("1234.56")).toBe("$1,234.56")
    })
  })

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-01-15")
      expect(formatDate(date)).toContain("Jan")
      expect(formatDate(date)).toContain("2024")
    })

    it("handles null values", () => {
      expect(formatDate(null)).toBe("—")
    })
  })

  describe("formatPhone", () => {
    it("formats 10-digit phone number", () => {
      expect(formatPhone("5551234567")).toBe("(555) 123-4567")
    })

    it("handles null values", () => {
      expect(formatPhone(null)).toBe("—")
    })
  })

  describe("formatStatus", () => {
    it("formats status with underscores", () => {
      expect(formatStatus("under_review")).toBe("Under Review")
    })

    it("handles single word status", () => {
      expect(formatStatus("draft")).toBe("Draft")
    })
  })
})

