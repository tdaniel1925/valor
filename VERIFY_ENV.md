# Environment Variables Verification Checklist

## Required Variables (Must Have)

### ✅ Supabase Configuration
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
- [ ] `DATABASE_URL` - PostgreSQL connection string (use DIRECT connection format for migrations)

## Optional Variables (For Future Integrations)

These can be left empty for now:
- `WINFLEX_API_KEY` / `WINFLEX_API_URL`
- `IPIPELINE_API_KEY` / `IPIPELINE_API_URL` / `IPIPELINE_GAID`
- `RATEWATCH_API_KEY` / `RATEWATCH_API_URL`
- `SURANCEBAY_API_KEY` / `SURANCEBAY_API_URL`
- `FIRELIGHT_API_KEY` / `FIRELIGHT_API_URL`
- `THREEMARK_API_KEY` / `THREEMARK_API_URL`
- `GOHIGHLEVEL_API_KEY` / `GOHIGHLEVEL_API_URL`

## How to Verify Your Setup

### 1. Check File Exists
```powershell
Test-Path .env.local
```

### 2. Verify All Required Variables Are Set
```powershell
$required = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL")
$envContent = Get-Content .env.local
foreach ($var in $required) {
    $found = $envContent | Select-String -Pattern "^$var="
    if ($found) {
        Write-Host "✅ $var is set"
    } else {
        Write-Host "❌ $var is MISSING"
    }
}
```

### 3. Test Supabase Connection
The app will test the connection when you run `npm run dev`. If you see connection errors, check:
- Supabase URL format: Should start with `https://` and end with `.supabase.co`
- Keys should be long JWT tokens starting with `eyJ`

### 4. Test Database Connection
Run `npm run db:push` to test database connection. If it fails:
- Check DATABASE_URL format (should use DIRECT connection for migrations)
- Verify password is correct
- Ensure no extra spaces or quotes in the connection string

## Common Issues

### Issue: "Missing environment variable"
**Solution**: Make sure `.env.local` exists in the root directory and contains all required variables

### Issue: "Invalid API key"
**Solution**: 
- Double-check you copied the entire key (they're very long)
- Make sure there are no line breaks in the middle of the key
- Verify you're using the correct key type (anon vs service_role)

### Issue: "Database connection failed"
**Solution**:
- Use DIRECT connection string format (not pooler)
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- Verify password matches your Supabase project password

## Quick Setup Commands

### View current variables (masked):
```powershell
Get-Content .env.local | ForEach-Object { 
    if ($_ -match "^([^=]+)=(.*)") { 
        $key = $matches[1]
        $val = $matches[2]
        if ($val.Length -gt 30) { $val = $val.Substring(0, 30) + "..." }
        Write-Host "$key = $val"
    }
}
```

### Test if variables are loaded:
```powershell
node -e "require('dotenv').config({ path: '.env.local' }); console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')"
```

