import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { permissions } from "./permissions";
import { rolePermissions } from "./permissions";

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentRoleId: uuid("parent_role_id").references((): any => roles.id), // For role inheritance
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rolesRelations = relations(roles, ({ one, many }) => ({
  parentRole: one(roles, {
    fields: [roles.parentRoleId],
    references: [roles.id],
    relationName: "parent_child_roles",
  }),
  childRoles: many(roles, {
    relationName: "parent_child_roles",
  }),
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

