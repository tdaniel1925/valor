import { pgTable, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "case.created", "quote.updated"
  entityType: varchar("entity_type", { length: 50 }).notNull(), // e.g., "case", "quote", "user"
  entityId: uuid("entity_id"), // ID of the affected entity
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // Additional data about the action
  ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

