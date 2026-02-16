# 🚀 Numer.me - Context Sharing via WhatsApp

A full-stack application that enables users to create shared context between phone numbers via WhatsApp messages. Built with React/TypeScript frontend and Node.js/Express backend, integrated with Twilio WhatsApp API.

![Architecture](https://img.shields.io/badge/Architecture-Monolith-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Twilio%20API-25D366)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Docker Deployment](#docker-deployment)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

Numer.me allows users to send contextual information between phone numbers via WhatsApp. Perfect for:
- Meeting new people and sharing contact context
- Creating shared memories with location and timestamp
- Sending context to yourself or others
- Privacy-first design (no data storage)

---

## ✨ Features

### Frontend (React + TypeScript)
- ✅ Modern, responsive UI with dark mode support
- ✅ Real-time form validation
- ✅ Phone number input with E.164 format
- ✅ Geolocation capture (optional)
- ✅ Shared context mode toggle
- ✅ Success/error feedback
- ✅ Built with shadcn/ui components

### Backend (Node.js + Express)
- ✅ RESTful API with comprehensive validation
- ✅ Twilio WhatsApp integration
- ✅ Rate limiting (5 requests/minute per phone)
- ✅ E.164 phone number validation
- ✅ Self-numer prevention
- ✅ Structured logging
- ✅ CORS enabled
- ✅ Docker ready

---

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Backend   │────────▶│   Twilio    │
│  (React)    │  HTTP   │  (Express)  │   API   │  WhatsApp   │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  WhatsApp   │
                        │  Recipients │
                        └─────────────┘
```

**Monolithic Architecture:**
- Single Express.js backend
- Synchronous WhatsApp sending
- No message queues
- Stateless (no database)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or bun
- Twilio account with WhatsApp sandbox

### Option 1: Docker (Recommended)

```bash
# Clone the repository
cd /Users/kevindaniel/Desktop/sidequest/numerme

# Set up environment variables
cp backend/.env.example backend/.env
cp context-connect/.env.example context-connect/.env

# Edit backend/.env with your Twilio credentials
# Edit context-connect/.env with backend URL

# Start with Docker Compose
docker-compose up
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Option 2: Manual Setup

See [Manual Setup](#manual-setup) section below.

---

## 🐳 Docker Deployment

### Using Docker Compose (Full Stack)

The project includes a `docker-compose.yml` that runs both frontend and backend:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Docker Containers

**Backend:**
```bash
cd backend
docker build -t numer-backend .
docker run -p 8000:8000 --env-file .env numer-backend
```

**Frontend:**
```bash
cd context-connect
docker build -t numer-frontend .
docker run -p 5173:5173 numer-frontend
```

---

## 🛠️ Manual Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Twilio credentials

# Start development server
npm run dev
```

Backend runs on: http://localhost:8000

### 2. Frontend Setup

```bash
cd context-connect

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend URL

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```bash
# Server
PORT=8000
NODE_ENV=development

# Twilio (Get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (`context-connect/.env`)

```bash
VITE_API_URL=http://localhost:8000
```

---

## 📡 API Documentation

### Endpoints

#### `POST /api/numer/send`
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

**Response (200):**
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

#### `GET /health`
Health check endpoint

#### `GET /api/numer/health`
Service-specific health check

---

## 📁 Project Structure

```
numerme/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (Twilio)
│   │   ├── middleware/        # Validation, rate limiting, errors
│   │   ├── utils/             # Helpers and validators
│   │   └── server.js          # Main application
│   ├── .env                   # Environment variables
│   ├── Dockerfile             # Backend container
│   └── package.json
│
├── context-connect/           # React/TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── utils/             # API client, validation
│   │   └── main.tsx           # Entry point
│   ├── .env                   # Environment variables
│   ├── Dockerfile             # Frontend container
│   └── package.json
│
├── docker-compose.yml         # Full-stack orchestration
├── README.md                  # This file
└── QUICK_START.md            # Quick start guide
```

---

## 💻 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with nodemon (hot reload)
npm start            # Start production mode
```

### Frontend Development

```bash
cd context-connect
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing

**Backend API Testing:**
```bash
# Health check
curl http://localhost:8000/health

# Send numer
curl -X POST http://localhost:8000/api/numer/send \
  -H "Content-Type: application/json" \
  -d '{
    "fromNumber": "+1234567890",
    "toNumber": "+0987654321",
    "context": "Test message"
  }'
```

---

## 🚀 Production Deployment

### Environment Setup

1. **Get Twilio WhatsApp Business Account** (not sandbox)
2. **Set production environment variables**
3. **Enable HTTPS**
4. **Configure CORS** for production domain

### Deployment Options

**Option 1: Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Option 2: Separate Deployments**
- Backend: Deploy to Heroku, Railway, AWS, etc.
- Frontend: Deploy to Vercel, Netlify, etc.

**Option 3: Kubernetes**
- Use provided Dockerfiles
- Create K8s manifests for deployment

---

## ⚠️ Important: Twilio WhatsApp Sandbox

Before testing, **both sender and recipient must join the Twilio WhatsApp Sandbox:**

1. Open WhatsApp
2. Add `+1 415 523 8886` to contacts
3. Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
4. Send the join code to `+1 415 523 8886`
5. Wait for confirmation

> **Note:** For production, upgrade to Twilio WhatsApp Business Account.

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Twilio credentials error:**
- Verify credentials in `backend/.env`
- Restart server: `npm run dev`

### Frontend Issues

**API connection failed:**
- Check `VITE_API_URL` in `context-connect/.env`
- Verify backend is running on correct port

### WhatsApp Issues

**Message not received:**
- Ensure both phones joined Twilio sandbox
- Check phone numbers are in E.164 format (+1234567890)
- Check backend logs for errors

**Rate limit exceeded:**
- Wait 60 seconds (5 requests/minute limit)

---

## 📚 Additional Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Quick Start Guide](QUICK_START.md) - Step-by-step setup
- [Implementation Walkthrough](.gemini/antigravity/brain/c340734a-2cb2-43d3-b113-7fc9c0c49471/walkthrough.md) - Development details

---

## 🔒 Security Notes

- No data is stored (stateless design)
- Rate limiting prevents spam
- CORS configured for specific origins
- Environment variables for sensitive data
- Input validation on all endpoints

---

## 🛣️ Roadmap

- [ ] WhatsApp Business API integration
- [ ] Message templates
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Message history (optional)
- [ ] User authentication

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions:
- Check [Troubleshooting](#troubleshooting) section
- Review [Quick Start Guide](QUICK_START.md)
- Check backend/frontend README files

---

**Built with ❤️ using React, Node.js, and Twilio WhatsApp API**
