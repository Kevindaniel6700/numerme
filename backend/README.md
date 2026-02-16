# Numer.me Backend - Monolith Architecture

## Overview

Numer.me backend is a Node.js/Express monolithic application that handles numer requests and sends WhatsApp messages via Twilio.

## Architecture

Simple monolithic architecture:
- Single Express.js application
- Synchronous WhatsApp sending via Twilio
- No message queues or separate workers
- Stateless design (no database)

## Features

- ✅ RESTful API for numer requests
- ✅ Phone number validation (E.164 format)
- ✅ Rate limiting (5 req/min per phone number)
- ✅ WhatsApp messaging via Twilio
- ✅ Shared context mode
- ✅ Geolocation metadata support
- ✅ Comprehensive error handling
- ✅ Request logging

## Tech Stack

- Node.js 18+
- Express.js
- Twilio SDK
- express-rate-limit

## API Endpoints

### POST /api/numer/send

Send a numer via WhatsApp

**Request:**
```json
{
  "fromNumber": "+1234567890",
  "toNumber": "+0987654321",
  "context": "Met at coffee shop",
  "sharedContext": false,
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2024-02-16T10:30:00Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Numer sent successfully",
  "results": [
    {
      "recipient": "+0987654321",
      "sid": "SM...",
      "status": "queued"
    }
  ]
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

### GET /health

Health check endpoint

### GET /

API information

## Installation

### Prerequisites

- Node.js 18 or higher
- Twilio account with WhatsApp sandbox

### Local Setup

1. **Clone repository**
```bash
cd /Users/kevindaniel/Desktop/sidequest/numerme/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and add your Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

4. **Run development server**
```bash
npm run dev
```

Server runs on http://localhost:8000

### Docker

**Build image**
```bash
docker build -t numer-backend .
```

**Run container**
```bash
docker run -p 8000:8000 --env-file .env numer-backend
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 8000 |
| NODE_ENV | Environment | development |
| TWILIO_ACCOUNT_SID | Twilio Account SID | ACxxxxxxxxx |
| TWILIO_AUTH_TOKEN | Twilio Auth Token | your_token |
| TWILIO_WHATSAPP_NUMBER | WhatsApp number | +14155238886 |
| ALLOWED_ORIGINS | CORS origins | http://localhost:3000 |

## Twilio Setup

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token from console
3. Enable WhatsApp sandbox
4. Join sandbox from your phone
5. Use sandbox number (+14155238886) in .env

## Rate Limiting

- 5 requests per minute per phone number
- Based on fromNumber field
- Returns 429 Too Many Requests if exceeded

## Validation Rules

- Phone numbers must be E.164 format (+1234567890)
- fromNumber and toNumber must be different
- context cannot be empty
- All required fields must be present

## Error Handling

All errors return JSON:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- 200: Success
- 400: Validation error
- 429: Rate limit exceeded
- 500: Server error

## Logging

All requests and operations are logged:
- Request method and path
- Twilio API calls
- Errors with stack traces

## Testing

### Manual Testing

```bash
curl -X POST http://localhost:8000/api/numer/send \
  -H "Content-Type: application/json" \
  -d '{
    "fromNumber": "+1234567890",
    "toNumber": "+0987654321",
    "context": "Test message"
  }'
```

## Production Considerations

1. **Environment**: Set NODE_ENV=production
2. **Logging**: Integrate with logging service (e.g., Winston, Loggly)
3. **Monitoring**: Add APM (e.g., New Relic, Datadog)
4. **Security**: Use HTTPS, environment secrets
5. **Scaling**: Use PM2 or cluster mode for multi-core

## License

MIT
