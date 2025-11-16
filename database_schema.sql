-- Valor Insurance Platform Database Schema
-- Paste this entire file into Supabase SQL Editor and run it

-- Create Enums
CREATE TYPE case_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending_requirements', 'issued');
CREATE TYPE case_type AS ENUM ('life', 'term', 'annuity', 'other');
CREATE TYPE commission_status AS ENUM ('pending', 'paid', 'cancelled');
CREATE TYPE quote_type AS ENUM ('life', 'term', 'annuity');

-- Create Organizations table (must be first due to foreign key references)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES organizations(id),
    hierarchy_path TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_auth_id UUID UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    organization_id UUID REFERENCES organizations(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_role_id UUID REFERENCES roles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create User Roles junction table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Create Role Permissions junction table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create Cases table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) UNIQUE,
    type case_type NOT NULL,
    status case_status NOT NULL DEFAULT 'draft',
    agent_id UUID NOT NULL REFERENCES users(id),
    client_info JSONB,
    carrier VARCHAR(100),
    product VARCHAR(200),
    face_amount TEXT,
    premium TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Quotes table
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE,
    type quote_type NOT NULL,
    agent_id UUID NOT NULL REFERENCES users(id),
    client_data JSONB NOT NULL,
    carrier VARCHAR(100),
    product VARCHAR(200),
    face_amount TEXT,
    premium TEXT,
    pdf_url TEXT,
    external_quote_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Commissions table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id),
    agent_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status commission_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP,
    period VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Contract Status Enum
CREATE TYPE contract_status AS ENUM ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'active', 'inactive');

-- Create Contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE,
    carrier VARCHAR(100) NOT NULL,
    agent_id UUID NOT NULL REFERENCES users(id),
    commission_rate DECIMAL(5, 2),
    status contract_status NOT NULL DEFAULT 'pending',
    effective_date TIMESTAMP,
    expiration_date TIMESTAMP,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Indexes for better query performance
CREATE INDEX idx_users_supabase_auth_id ON users(supabase_auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_organizations_parent_id ON organizations(parent_id);
CREATE INDEX idx_cases_agent_id ON cases(agent_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_type ON cases(type);
CREATE INDEX idx_quotes_agent_id ON quotes(agent_id);
CREATE INDEX idx_quotes_type ON quotes(type);
CREATE INDEX idx_commissions_agent_id ON commissions(agent_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_case_id ON commissions(case_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_contracts_agent_id ON contracts(agent_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_case_id ON notes(case_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Activity Logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    description TEXT NOT NULL,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

