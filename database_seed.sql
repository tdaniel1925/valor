-- Seed Data for Valor Insurance Platform
-- Run this AFTER running database_schema.sql
-- This creates initial roles, permissions, and a root organization
-- Safe to run multiple times - will skip existing records

-- Insert Root Organization (skip if exists)
INSERT INTO organizations (id, name, hierarchy_path) 
SELECT gen_random_uuid(), 'Valor Financial Specialists', '1'
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Valor Financial Specialists');

-- Insert Roles (Executive and Administrator first, skip if exists)
INSERT INTO roles (id, name, description) 
SELECT gen_random_uuid(), 'Executive', 'Organization owner/executive with full access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Executive');

INSERT INTO roles (id, name, description) 
SELECT gen_random_uuid(), 'Administrator', 'System administrator'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Administrator');

-- Insert Manager role (with parent reference to Executive, skip if exists)
INSERT INTO roles (id, name, description, parent_role_id) 
SELECT 
    gen_random_uuid(), 
    'Manager', 
    'Agency manager with team oversight',
    id
FROM roles WHERE name = 'Executive' LIMIT 1
ON CONFLICT (name) DO NOTHING;

-- Insert Agent role (with parent reference to Manager, skip if exists)
INSERT INTO roles (id, name, description, parent_role_id) 
SELECT 
    gen_random_uuid(), 
    'Agent', 
    'Independent insurance agent',
    id
FROM roles WHERE name = 'Manager' LIMIT 1
ON CONFLICT (name) DO NOTHING;

-- Insert Permissions (skip if exists)
INSERT INTO permissions (resource, action, description) 
SELECT 'dashboard', 'read', 'Access dashboard'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'dashboard' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'cases', 'read', 'View cases'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'cases' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'cases', 'write', 'Create and edit cases'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'cases' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'cases', 'delete', 'Delete cases'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'cases' AND action = 'delete');

INSERT INTO permissions (resource, action, description) 
SELECT 'quotes', 'read', 'View quotes'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'quotes' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'quotes', 'write', 'Create and edit quotes'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'quotes' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'contracts', 'read', 'View contracts'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'contracts' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'contracts', 'write', 'Create and edit contracts'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'contracts' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'commissions', 'read', 'View commissions'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'commissions' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'reports', 'read', 'View reports'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'reports' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'reports', 'write', 'Create reports'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'reports' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'users', 'read', 'View users'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'users' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'users', 'write', 'Create and edit users'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'users' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'users', 'admin', 'Full user administration'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'users' AND action = 'admin');

INSERT INTO permissions (resource, action, description) 
SELECT 'organizations', 'read', 'View organizations'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'organizations' AND action = 'read');

INSERT INTO permissions (resource, action, description) 
SELECT 'organizations', 'write', 'Create and edit organizations'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'organizations' AND action = 'write');

INSERT INTO permissions (resource, action, description) 
SELECT 'organizations', 'admin', 'Full organization administration'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE resource = 'organizations' AND action = 'admin');

-- Assign permissions to Executive role (all permissions, skip duplicates)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Executive'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Manager role (most permissions except user/admin org management, skip duplicates)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Manager'
AND NOT (p.resource = 'users' AND p.action = 'admin')
AND NOT (p.resource = 'organizations' AND p.action = 'admin')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Agent role (basic read/write for cases, quotes, contracts, commissions, skip duplicates)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Agent'
AND p.resource IN ('cases', 'quotes', 'contracts', 'commissions')
AND p.action IN ('read', 'write')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Admin role (all permissions, skip duplicates)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Administrator'
ON CONFLICT (role_id, permission_id) DO NOTHING;

