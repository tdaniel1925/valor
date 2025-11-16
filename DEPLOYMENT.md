# Deployment Guide

This guide covers deploying the Valor Insurance Platform to production.

## Prerequisites

- Node.js 18+ installed
- Supabase project created
- Environment variables configured
- Database schema deployed

## Environment Setup

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_connection_string

# Optional: Email
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVICE_API_KEY=your_email_service_key
```

## Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   - Import your repository to Vercel
   - Connect your Git provider

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or deploy manually from Vercel dashboard

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3006
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t valor-insurance-platform .
   docker run -p 3006:3006 --env-file .env.local valor-insurance-platform
   ```

### Self-Hosted

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "valor-platform" -- start
   pm2 save
   pm2 startup
   ```

## Database Migration

### Option 1: Manual SQL (Recommended for initial setup)

1. Open Supabase SQL Editor
2. Run `database_schema.sql` to create tables
3. Run `database_seed.sql` to seed initial data

### Option 2: Drizzle Kit

```bash
npm run db:push
npm run db:seed
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test database connection
- [ ] Verify Supabase authentication works
- [ ] Test API endpoints
- [ ] Verify email notifications (if configured)
- [ ] Check security headers
- [ ] Verify SSL/HTTPS is enabled
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up error tracking (e.g., Sentry)

## Monitoring

### Health Check Endpoint

Monitor application health:
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "supabase": "connected"
  }
}
```

### Recommended Monitoring Tools

- **Application Monitoring**: Vercel Analytics, Sentry
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Web Vitals

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use secure secret management (Vercel, AWS Secrets Manager, etc.)

2. **Database**
   - Use connection pooling
   - Enable SSL for database connections
   - Restrict database access by IP

3. **API Security**
   - Rate limiting is implemented
   - Authentication required for all API routes
   - CORS configured appropriately

4. **Headers**
   - Security headers configured in middleware
   - HTTPS enforced in production

## Scaling Considerations

1. **Database**
   - Use Supabase connection pooling
   - Consider read replicas for heavy read workloads
   - Monitor query performance

2. **Application**
   - Use Next.js Edge Runtime where possible
   - Implement caching strategies
   - Use CDN for static assets

3. **Storage**
   - Supabase Storage for file uploads
   - Consider CDN for frequently accessed files

## Backup Strategy

1. **Database Backups**
   - Supabase provides automatic daily backups
   - Configure additional manual backups if needed

2. **Application Backups**
   - Version control (Git) serves as code backup
   - Keep deployment history

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check if using direct connection (not pooler) for migrations
   - Verify database is accessible from deployment environment

2. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs in Supabase dashboard
   - Verify OAuth providers are configured

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

## Support

For deployment issues, check:
- Application logs
- Supabase dashboard logs
- Vercel deployment logs (if using Vercel)
- Health check endpoint

