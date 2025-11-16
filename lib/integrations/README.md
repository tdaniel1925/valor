# Integration Services

This directory contains integration services for third-party APIs.

## Structure

Each integration follows a common pattern:
- Base class (`base.ts`) - Common functionality
- Service implementation (e.g., `winflex.ts`) - Specific API integration
- API routes (`app/api/integrations/[service]/`) - HTTP endpoints

## Available Integrations

### WinFlex/Zinnia (Life Insurance Quotes)
- **Status**: Placeholder ready for implementation
- **Location**: `lib/integrations/winflex.ts`
- **API Route**: `/api/integrations/winflex/quote`

### iPipeline (Term Quotes)
- **Status**: Placeholder ready for implementation
- **Location**: `lib/integrations/ipipeline.ts`
- **API Route**: `/api/integrations/ipipeline/term-quote`

### RateWatch (Annuity Quotes)
- **Status**: Placeholder ready for implementation
- **Location**: `lib/integrations/ratewatch.ts`
- **API Route**: `/api/integrations/ratewatch/annuity-quote`

## Implementation Guide

### Step 1: Add API Credentials

Add to `.env.local`:
```env
WINFLEX_API_KEY=your_api_key
WINFLEX_API_URL=https://api.winflex.com
```

### Step 2: Implement Service

Update the service file (e.g., `winflex.ts`):
```typescript
export class WinFlexService extends BaseIntegrationService {
  async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    // Implement API call
  }
}
```

### Step 3: Update API Route

Update the API route to use the service:
```typescript
const service = new WinFlexService()
const quote = await service.getQuote(params)
```

### Step 4: Add Error Handling

Use the base class error handling:
```typescript
try {
  return await this.makeRequest(url, options)
} catch (error) {
  this.handleError(error)
}
```

## Base Integration Features

- Retry logic with exponential backoff
- Error handling
- Request/response logging
- Rate limiting support
- Circuit breaker pattern (ready for implementation)

## Testing

Test integrations in development:
1. Set up test API credentials
2. Use the API routes directly
3. Check activity logs for requests
4. Verify error handling

## Best Practices

1. **Error Handling**: Always use try-catch and log errors
2. **Rate Limiting**: Respect API rate limits
3. **Caching**: Cache responses when appropriate
4. **Retries**: Use exponential backoff for transient errors
5. **Logging**: Log all API interactions for debugging

