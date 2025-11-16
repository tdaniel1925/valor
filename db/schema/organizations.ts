import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: uuid("parent_id").references((): any => organizations.id),
  hierarchyPath: text("hierarchy_path"), // ltree path for hierarchy queries
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  parent: one(organizations, {
    fields: [organizations.parentId],
    references: [organizations.id],
    relationName: "parent_children",
  }),
  children: many(organizations, {
    relationName: "parent_children",
  }),
  users: many(users),
}));

