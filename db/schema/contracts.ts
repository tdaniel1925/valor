import { pgTable, uuid, varchar, text, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const contractStatusEnum = pgEnum("contract_status", [
  "pending",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "active",
  "inactive",
]);

export const contracts = pgTable("contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractNumber: varchar("contract_number", { length: 50 }).unique(),
  carrier: varchar("carrier", { length: 100 }).notNull(),
  agentId: uuid("agent_id").references(() => users.id).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }), // e.g., 5.50 for 5.5%
  status: contractStatusEnum("status").default("pending").notNull(),
  effectiveDate: timestamp("effective_date"),
  expirationDate: timestamp("expiration_date"),
  documentUrl: text("document_url"), // URL to contract document in Supabase Storage
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  agent: one(users, {
    fields: [contracts.agentId],
    references: [users.id],
  }),
}));

