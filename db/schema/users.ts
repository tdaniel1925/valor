import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations } from "./organizations";
import { userRoles } from "./roles";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  supabaseAuthId: uuid("supabase_auth_id").unique().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  organizationId: uuid("organization_id").references(() => organizations.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  userRoles: many(userRoles),
}));

