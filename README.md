# Valor Insurance Platform

A unified insurance back office platform built with Next.js, Supabase, Drizzle ORM, and shadcn/ui.

## Features

- ✅ **Authentication**: Supabase Auth with email/password and Google OAuth
- ✅ **Dashboard**: Production metrics (YTD/MTD/QTD), recent cases, pending commissions
- ✅ **Quote Management**: Create, view, and manage life, term, and annuity quotes
- ✅ **Case Management**: Track cases with status workflow and client information
- ✅ **Commission Tracking**: View pending and paid commissions with totals
- ✅ **Contract Management**: Request and track carrier contracts
- ✅ **User Management**: Admin interface for managing users and roles
- ✅ **Settings**: User profile management
- ✅ **Reports**: Report structure (detailed reports coming soon)
- ✅ **RBAC**: Role-based access control with permissions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd valor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` (if it exists) or create `.env.local`
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

   See `SETUP_ENV.md` for detailed instructions.

4. Set up the database:
   - Option A: Use Drizzle Kit (if connection works):
     ```bash
     npm run db:push
     npm run db:seed
     ```
   
   - Option B: Manual SQL setup (recommended if migrations fail):
     - Open Supabase SQL Editor
     - Run `database_schema.sql` to create all tables
     - Run `database_seed.sql` to seed initial data

5. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3006`

## Database Setup

### Manual SQL Setup (Recommended)

If Drizzle migrations fail, use the provided SQL scripts:

1. **Create Schema**: Run `database_schema.sql` in Supabase SQL Editor
   - Creates all tables, enums, indexes, and triggers

2. **Seed Data**: Run `database_seed.sql` in Supabase SQL Editor
   - Creates root organization
   - Creates roles (Executive, Administrator, Manager, Agent)
   - Creates permissions
   - Assigns permissions to roles

### Database Connection

Make sure you're using the **Direct Connection** string from Supabase:
- Username: `postgres`
- Host: `db.your-project-ref.supabase.co:5432`
- NOT the pooler connection string

## Project Structure

```
valor/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and metrics
│   ├── quotes/            # Quote management
│   ├── cases/             # Case management
│   ├── commissions/       # Commission tracking
│   ├── contracts/         # Contract management
│   ├── users/             # User management (admin)
│   ├── settings/          # User settings
│   └── reports/           # Reports
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   ├── cases/             # Case components
│   ├── quotes/            # Quote components
│   └── layout/            # Layout components
├── db/                     # Database schema and migrations
│   └── schema/            # Drizzle schema definitions
├── lib/                    # Utility libraries
│   ├── supabase/          # Supabase client/server utilities
│   ├── permissions/       # RBAC permission checking
│   └── utils/             # General utilities
└── drizzle/               # Generated migrations (if using Drizzle)

```

## Available Scripts

- `npm run dev` - Start development server (port 3006)
- `npm run build` - Build for production
- `npm run start` - Start production server (port 3006)
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run Drizzle migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with initial data

## Authentication

The platform uses Supabase Auth for authentication:

- **Email/Password**: Standard email and password authentication
- **Google OAuth**: Sign in with Google (configure in Supabase dashboard)
- **Session Management**: Handled automatically by Supabase

## Permissions & Roles

The platform includes a role-based access control (RBAC) system:

- **Executive**: Full access to all features
- **Administrator**: System administration
- **Manager**: Team management and reporting
- **Agent**: Standard user access

Permissions are checked on each page and API route.

## Development

### Adding New Features

1. Create database schema in `db/schema/`
2. Export from `db/schema/index.ts`
3. Create API routes in `app/api/`
4. Create pages in `app/`
5. Create components in `components/`

### Database Migrations

When schema changes are made:

1. Update schema files in `db/schema/`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `drizzle/`
4. Push to database: `npm run db:push`

Or manually update `database_schema.sql` and run in Supabase SQL Editor.

## Troubleshooting

### Database Connection Issues

- Ensure you're using the Direct Connection string (not pooler)
- Check that `DATABASE_URL` in `.env.local` is correct
- Verify Supabase project credentials

### Authentication Issues

- Check Supabase project URL and anon key
- Verify OAuth providers are configured in Supabase dashboard
- Check browser console for errors

### Permission Errors

- Ensure user has appropriate roles assigned
- Check `database_seed.sql` was run to create roles/permissions
- Verify user has `user_roles` entry in database

## Features Completed

✅ **Core Platform**
- Authentication with Supabase (email/password, Google OAuth)
- Dashboard with production metrics
- Quote management (CRUD + Convert to Case)
- Case management (CRUD + Edit + Notes)
- Commission tracking
- Contract management
- User management (admin)
- Settings & profile management
- Reports structure

✅ **Advanced Features**
- Activity/audit logging
- Sortable data tables
- Bulk actions (delete, export)
- Toast notifications
- Loading skeletons
- Quick actions widget
- Notes/communication system
- Quote-to-case conversion
- CSV export functionality
- Advanced search with filters
- Mobile-responsive navigation
- Print functionality
- Email notification templates
- Form validation system
- Rate limiting
- Accessibility utilities
- Error handling components

✅ **Infrastructure**
- Complete database schema
- RBAC permissions system
- API routes with activity logging
- Security headers middleware
- Health check endpoint
- Environment variable validation
- Standardized API responses

## Next Steps

- [ ] Integrate third-party APIs (WinFlex, iPipeline, RateWatch, etc.)
- [ ] Connect email service provider (SendGrid, Resend, etc.)
- [ ] Add detailed reporting with charts (Recharts)
- [ ] Implement advanced document management
- [ ] Add real-time updates (WebSockets)
- [ ] Build custom report builder
- [ ] Add more comprehensive tests
- [ ] Set up CI/CD pipeline

## License

Private - Valor Financial Specialists

## Support

For issues or questions, contact the development team.
