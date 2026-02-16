# Docker Deployment Setup

## Prerequisites
Before running the application with Docker, you need to configure your Twilio credentials.

## Configuration Steps

1. **Backend Environment Variables**
   - Copy the example environment file:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Edit `backend/.env` and add your Twilio credentials:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid_here
     TWILIO_AUTH_TOKEN=your_auth_token_here
     TWILIO_WHATSAPP_NUMBER=+14155238886
     ```

2. **Run with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

## Important Notes
- Never commit `.env` files to the repository
- The `.env` file contains sensitive credentials
- Make sure Docker Desktop is running before executing docker-compose commands
