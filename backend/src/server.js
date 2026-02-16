/**
 * Numer.me Backend Server - Monolith Architecture
 * Handles numer requests and sends WhatsApp messages via Twilio
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import numerRoutes from './routes/numer.routes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Numer.me API - Monolith Architecture',
        version: '1.0.0',
        status: 'healthy',
        architecture: 'monolith'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/numer', numerRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Numer.me Backend running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('⚠️ Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('⚠️ Shutting down gracefully...');
    process.exit(0);
});
