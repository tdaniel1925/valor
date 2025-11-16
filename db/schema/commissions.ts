import { pgTable, uuid, varchar, text, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { cases } from "./cases";

export const commissionStatusEnum = pgEnum("commission_status", [
  "pending",
  "paid",
  "cancelled",
]);

export const commissions = pgTable("commissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id),
  agentId: uuid("agent_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: commissionStatusEnum("status").default("pending").notNull(),
  paidAt: timestamp("paid_at"),
  period: varchar("period", { length: 20 }), // e.g., "2024-Q1", "2024-01"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commissionsRelations = relations(commissions, ({ one }) => ({
  case: one(cases, {
    fields: [commissions.caseId],
    references: [cases.id],
  }),
  agent: one(users, {
    fields: [commissions.agentId],
    references: [users.id],
  }),
}));

