# Contributing Guide

Thank you for your interest in contributing to the Valor Insurance Platform!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd valor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials

4. **Set up database**
   - Run `database_schema.sql` in Supabase SQL Editor
   - Run `database_seed.sql` to seed initial data

5. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use Prettier for formatting
- Use ESLint for linting

## Project Structure

```
valor/
├── app/              # Next.js App Router pages
├── components/       # React components
├── db/              # Database schema and migrations
├── lib/             # Utility libraries
└── public/          # Static assets
```

## Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/tooling changes

## Component Guidelines

- Use TypeScript interfaces for props
- Include proper error handling
- Add loading states
- Make components accessible
- Use shadcn/ui components when possible

## API Route Guidelines

- Use standardized response helpers (`lib/api/response.ts`)
- Include proper error handling
- Validate input data
- Log activities for audit trail
- Check permissions before operations

## Database Guidelines

- Add migrations for schema changes
- Update `database_schema.sql` for manual setup
- Include indexes for performance
- Add foreign key constraints

## Testing

- Test your changes manually
- Verify error cases
- Test on different screen sizes
- Verify accessibility

## Questions?

Feel free to open an issue or contact the maintainers.

