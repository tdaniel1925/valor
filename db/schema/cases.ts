import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const caseStatusEnum = pgEnum("case_status", [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "pending_requirements",
  "issued",
]);

export const caseTypeEnum = pgEnum("case_type", [
  "life",
  "term",
  "annuity",
  "other",
]);

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseNumber: varchar("case_number", { length: 50 }).unique(),
  type: caseTypeEnum("type").notNull(),
  status: caseStatusEnum("status").default("draft").notNull(),
  agentId: uuid("agent_id").references(() => users.id).notNull(),
  clientInfo: jsonb("client_info"), // Store client data as JSON
  carrier: varchar("carrier", { length: 100 }),
  product: varchar("product", { length: 200 }),
  faceAmount: text("face_amount"), // Store as text to handle large numbers
  premium: text("premium"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const casesRelations = relations(cases, ({ one }) => ({
  agent: one(users, {
    fields: [cases.agentId],
    references: [users.id],
  }),
}));

