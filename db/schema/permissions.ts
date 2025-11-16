import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles";

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  resource: varchar("resource", { length: 100 }).notNull(), // e.g., "cases", "quotes", "contracts"
  action: varchar("action", { length: 50 }).notNull(), // e.g., "read", "write", "delete", "admin"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

