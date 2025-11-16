# Correct Supabase Connection String Format

## For Direct Connections (Migrations)

The connection string format should be:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**NOT:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-...pooler.supabase.com:5432/postgres
```

## How to Get the Correct Format

1. Go to Supabase Dashboard → Settings → Database
2. Under **Connection string**, select **"Direct connection"**
3. Select **"URI"** format (not "JDBC" or others)
4. Copy the string - it should start with `postgresql://postgres:` not `postgresql://postgres.`

## Example

**Wrong (Pooler format):**
```
postgresql://postgres.vznkfnsmebmzjnquzuph:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Correct (Direct format):**
```
postgresql://postgres:password@db.vznkfnsmebmzjnquzuph.supabase.co:5432/postgres
```

## Update Your .env.local

Replace your `DATABASE_URL` with the correct direct connection format from Supabase.

The key differences:
- Username: `postgres` (not `postgres.xxxxx`)
- Host: `db.xxxxx.supabase.co` (not `aws-...pooler.supabase.com`)
- Port: `5432` (same)

