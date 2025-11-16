import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { cases } from "./cases";

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(), // Internal notes vs client-facing
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notesRelations = relations(notes, ({ one }) => ({
  case: one(cases, {
    fields: [notes.caseId],
    references: [cases.id],
  }),
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

