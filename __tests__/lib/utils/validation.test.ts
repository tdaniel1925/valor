import { z } from "zod"
import {
  emailSchema,
  phoneSchema,
  caseStatusSchema,
} from "@/lib/utils/validation-helpers-extended"

describe("validation schemas", () => {
  describe("emailSchema", () => {
    it("validates correct email", () => {
      expect(() => emailSchema.parse("test@example.com")).not.toThrow()
    })

    it("rejects invalid email", () => {
      expect(() => emailSchema.parse("invalid-email")).toThrow()
    })
  })

  describe("phoneSchema", () => {
    it("validates US phone format", () => {
      expect(() => phoneSchema.parse("(555) 123-4567")).not.toThrow()
      expect(() => phoneSchema.parse("555-123-4567")).not.toThrow()
    })

    it("rejects invalid phone", () => {
      expect(() => phoneSchema.parse("123")).toThrow()
    })
  })

  describe("caseStatusSchema", () => {
    it("validates correct status", () => {
      expect(() => caseStatusSchema.parse("approved")).not.toThrow()
    })

    it("rejects invalid status", () => {
      expect(() => caseStatusSchema.parse("invalid")).toThrow()
    })
  })
})

