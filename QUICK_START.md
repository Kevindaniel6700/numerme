# 🚀 Numer.me - Quick Start Guide

## Backend is Ready! ✅

Your Numer.me backend is fully implemented and running on **http://localhost:8000**

---

## ⚠️ IMPORTANT: Join Twilio WhatsApp Sandbox

Before you can send WhatsApp messages, **both the sender and recipient** must join the Twilio WhatsApp Sandbox:

### Steps to Join:

1. **Open WhatsApp** on your phone
2. **Add this number** to your contacts: `+1 415 523 8886`
3. **Get your join code**:
   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - You'll see a message like: "join abc-xyz"
4. **Send the join code** to `+1 415 523 8886` on WhatsApp
5. **Wait for confirmation** from Twilio

> **Note:** Every phone number that wants to receive messages must join the sandbox!

---

## 🎯 Testing the Complete System

### Option 1: Test via Frontend (Recommended)

1. **Start the frontend** (if not already running):
   ```bash
   cd /Users/kevindaniel/Desktop/sidequest/numerme/context-connect
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Fill in the form**:
   - **From**: Your phone number (E.164 format: +1234567890)
   - **To**: Recipient's phone number (E.164 format)
   - **Context**: Any message you want to send
   - **Shared Context**: Toggle if you want both parties to receive the message

4. **Click "Send Numer"**

5. **Check WhatsApp** on both phones!

### Option 2: Test via API (curl)

```bash
curl -X POST http://localhost:8000/api/numer/send \
  -H "Content-Type: application/json" \
  -d '{
    "fromNumber": "+YOUR_PHONE_NUMBER",
    "toNumber": "+RECIPIENT_PHONE_NUMBER",
    "context": "Testing Numer.me! 🎉",
    "sharedContext": false,
    "location": {"lat": 40.7128, "lng": -74.0060},
    "timestamp": "2024-02-16T10:30:00Z"
  }'
```

---

## 📱 Expected WhatsApp Message Format

When you send a numer, the recipient will receive a WhatsApp message like:

```
📱 New Numer

Context: Testing Numer.me! 🎉
From: +1234567890
When: 2/16/2024, 10:30:00 AM
Where: 40.7128, -74.0060

---
Sent via Numer.me
```

---

## ✅ What's Working

- ✅ Backend server running on port 8000
- ✅ Health endpoints responding
- ✅ Validation middleware working
- ✅ Rate limiting active (5 requests/minute)
- ✅ Twilio credentials configured
- ✅ Frontend configured to connect to backend
- ✅ CORS enabled for frontend

---

## 🔧 Troubleshooting

### "Twilio credentials not configured" error
- Check that your `.env` file has the correct credentials
- Restart the backend server: `npm run dev`

### "Cannot send Numer to yourself" error
- Make sure `fromNumber` and `toNumber` are different

### "Invalid phone number format" error
- Use E.164 format: `+[country code][number]`
- Example: `+14155551234` (not `4155551234` or `+1-415-555-1234`)

### WhatsApp message not received
- **Both phones must join the Twilio WhatsApp Sandbox** (see instructions above)
- Check that phone numbers are in E.164 format
- Check backend logs for errors

### Rate limit error
- You can only send 5 messages per minute from the same phone number
- Wait 60 seconds and try again

---

## 📂 Project Structure

```
numerme/
├── backend/              ← Backend (Node.js/Express)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env             ← Your Twilio credentials
│   └── package.json
│
└── context-connect/      ← Frontend (React/TypeScript)
    ├── src/
    ├── .env             ← Backend URL
    └── package.json
```

---

## 🎉 You're All Set!

Your Numer.me application is fully functional. Just:

1. ✅ Join the Twilio WhatsApp Sandbox
2. ✅ Start the frontend
3. ✅ Send your first numer!

---

## 📚 Additional Resources

- **Backend README**: `/Users/kevindaniel/Desktop/sidequest/numerme/backend/README.md`
- **Twilio Console**: https://console.twilio.com
- **WhatsApp Sandbox**: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
