# API Documentation

Complete API reference for the Valor Insurance Platform.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

All API routes (except `/api/health` and `/api/auth/*`) require authentication via Supabase Auth.

Include the session cookie in requests, or use the Supabase client SDK.

## Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Health Check

#### GET `/api/health`
Check application health status.

**Response:**
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

### Cases

#### GET `/api/cases`
Get all cases for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `type` (optional): Filter by type

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "caseNumber": "CASE-001",
      "type": "life",
      "status": "submitted",
      "clientInfo": { ... },
      "carrier": "Carrier Name",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/cases`
Create a new case.

**Request Body:**
```json
{
  "type": "life",
  "status": "draft",
  "clientInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "carrier": "Carrier Name",
  "product": "Product Name",
  "faceAmount": "$500,000",
  "premium": "$500/month"
}
```

#### GET `/api/cases/[id]`
Get a specific case by ID.

#### PATCH `/api/cases/[id]`
Update a case.

**Request Body:** Same as POST, all fields optional.

#### DELETE `/api/cases/[id]`
Delete a case.

#### GET `/api/cases/[id]/notes`
Get notes for a case.

#### POST `/api/cases/[id]/notes`
Add a note to a case.

**Request Body:**
```json
{
  "content": "Note content",
  "isInternal": false
}
```

### Quotes

#### GET `/api/quotes`
Get all quotes for the authenticated user.

**Response:** Array of quote objects

#### POST `/api/quotes`
Create a new quote.

**Request Body:**
```json
{
  "type": "life",
  "carrier": "Carrier Name",
  "product": "Product Name",
  "faceAmount": "$500,000",
  "premium": "$500/month",
  "clientData": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Commissions

#### GET `/api/commissions`
Get all commissions for the authenticated user.

**Response:** Array of commission objects

#### POST `/api/commissions`
Create a new commission record.

**Request Body:**
```json
{
  "caseId": "uuid",
  "amount": 1000.00,
  "status": "pending",
  "period": "2024-01"
}
```

### Contracts

#### GET `/api/contracts`
Get all contracts for the authenticated user.

#### POST `/api/contracts`
Request a new contract.

**Request Body:**
```json
{
  "carrier": "Carrier Name",
  "commissionRate": 5.5,
  "notes": "Contract notes"
}
```

### Users

#### GET `/api/users`
Get all users (admin only).

#### GET `/api/users/me`
Get current user profile.

#### PATCH `/api/users/me`
Update current user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-1234"
}
```

### Dashboard

#### GET `/api/dashboard/production`
Get production metrics (YTD/MTD/QTD).

**Response:**
```json
{
  "data": {
    "ytd": {
      "cases": 10,
      "premium": 0,
      "commissions": 5000
    },
    "mtd": { ... },
    "qtd": { ... }
  }
}
```

### Activity

#### GET `/api/activity`
Get activity logs.

**Query Parameters:**
- `entityType` (optional): Filter by entity type
- `entityId` (optional): Filter by entity ID
- `limit` (optional): Limit results (default: 50)

### Documents

#### POST `/api/documents/upload`
Upload a document.

**Request:** Multipart form data
- `file`: File to upload
- `bucket`: Storage bucket name
- `folder`: Optional folder path

**Response:**
```json
{
  "data": {
    "url": "https://...",
    "path": "documents/..."
  }
}
```

## Error Codes

- `UNAUTHORIZED` (401): Not authenticated
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Validation failed
- `DUPLICATE_KEY` (409): Duplicate entry
- `SERVER_ERROR` (500): Internal server error

## Rate Limiting

API endpoints are rate-limited. Check response headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests

## Examples

### Create a Case

```typescript
const response = await fetch('/api/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'life',
    status: 'draft',
    clientInfo: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  })
})

const { data } = await response.json()
```

### Get Cases with Filtering

```typescript
const response = await fetch('/api/cases?status=submitted&page=1&pageSize=10')
const { data } = await response.json()
```

### Add Note to Case

```typescript
const response = await fetch(`/api/cases/${caseId}/notes`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Client called to follow up',
    isInternal: false
  })
})
```

