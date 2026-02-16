/**
 * Numer API Routes
 * Handles numer request validation and WhatsApp sending
 */
import express from 'express';
import whatsappService from '../services/whatsapp.service.js';
import { validateNumerRequest } from '../middleware/validation.js';
import rateLimiter from '../middleware/rateLimiter.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/numer/send
 * Send a numer via WhatsApp (synchronous)
 */
router.post('/send', rateLimiter, validateNumerRequest, async (req, res, next) => {
    try {
        const numerData = {
            fromNumber: req.body.fromNumber,
            toNumber: req.body.toNumber,
            context: req.body.context,
            sharedContext: req.body.sharedContext || false,
            location: req.body.location || null,
            timestamp: req.body.timestamp || new Date().toISOString()
        };

        logger.info('Processing numer request', {
            from: numerData.fromNumber,
            to: numerData.toNumber,
            shared: numerData.sharedContext
        });

        // Send WhatsApp messages via Twilio (synchronous)
        const results = await whatsappService.sendNumer(numerData);

        // Check if all messages sent successfully
        const failed = results.filter(r => !r.success);

        if (failed.length > 0) {
            logger.error('Some messages failed to send', { failed });

            return res.status(500).json({
                success: false,
                message: 'Some messages failed to send',
                results
            });
        }

        logger.info('✅ All messages sent successfully', {
            recipients: results.map(r => r.recipient)
        });

        // Return 200 OK with success details
        res.status(200).json({
            success: true,
            message: 'Numer sent successfully',
            results: results.map(r => ({
                recipient: r.recipient,
                sid: r.sid,
                status: r.status
            }))
        });

    } catch (error) {
        logger.error('Error sending numer:', error);
        next(error);
    }
});

/**
 * GET /api/numer/health
 * Health check for numer service
 */
router.get('/health', (req, res) => {
    res.json({
        service: 'numer',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

export default router;
