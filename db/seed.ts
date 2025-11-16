import { db } from "./index";
import { organizations, roles, permissions, rolePermissions, users, userRoles } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Create root organization
  const [rootOrg] = await db.insert(organizations).values({
    name: "Valor Financial Specialists",
    hierarchyPath: "1",
  }).returning();

  // Create roles
  const [executiveRole] = await db.insert(roles).values({
    name: "Executive",
    description: "Organization owner/executive with full access",
  }).returning();

  const [managerRole] = await db.insert(roles).values({
    name: "Manager",
    description: "Agency manager with team oversight",
    parentRoleId: executiveRole.id,
  }).returning();

  const [agentRole] = await db.insert(roles).values({
    name: "Agent",
    description: "Independent insurance agent",
    parentRoleId: managerRole.id,
  }).returning();

  const [adminRole] = await db.insert(roles).values({
    name: "Administrator",
    description: "System administrator",
  }).returning();

  // Create permissions
  const allPermissions = await db.insert(permissions).values([
    { resource: "dashboard", action: "read" },
    { resource: "cases", action: "read" },
    { resource: "cases", action: "write" },
    { resource: "cases", action: "delete" },
    { resource: "quotes", action: "read" },
    { resource: "quotes", action: "write" },
    { resource: "contracts", action: "read" },
    { resource: "contracts", action: "write" },
    { resource: "commissions", action: "read" },
    { resource: "reports", action: "read" },
    { resource: "reports", action: "write" },
    { resource: "users", action: "read" },
    { resource: "users", action: "write" },
    { resource: "users", action: "admin" },
    { resource: "organizations", action: "read" },
    { resource: "organizations", action: "write" },
    { resource: "organizations", action: "admin" },
  ]).returning();

  // Assign permissions to roles
  // Executive gets all permissions
  await db.insert(rolePermissions).values(
    allPermissions.map(p => ({
      roleId: executiveRole.id,
      permissionId: p.id,
    }))
  );

  // Manager gets most permissions except user/admin org management
  const managerPerms = allPermissions.filter(p => 
    !p.resource.includes("users") || p.action !== "admin"
  );
  await db.insert(rolePermissions).values(
    managerPerms.map(p => ({
      roleId: managerRole.id,
      permissionId: p.id,
    }))
  );

  // Agent gets basic read/write permissions
  const agentPerms = allPermissions.filter(p => 
    ["cases", "quotes", "contracts", "commissions"].includes(p.resource) &&
    ["read", "write"].includes(p.action)
  );
  await db.insert(rolePermissions).values(
    agentPerms.map(p => ({
      roleId: agentRole.id,
      permissionId: p.id,
    }))
  );

  // Admin gets all permissions
  await db.insert(rolePermissions).values(
    allPermissions.map(p => ({
      roleId: adminRole.id,
      permissionId: p.id,
    }))
  );

  console.log("Seed completed successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

