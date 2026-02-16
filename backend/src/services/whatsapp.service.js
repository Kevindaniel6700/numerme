/**
 * WhatsApp Service using Twilio
 * Formats and sends WhatsApp messages synchronously
 */
import twilio from 'twilio';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Initialize Twilio client only if credentials are provided
let client = null;

if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID !== 'your_account_sid_here') {
    client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    logger.info('✅ Twilio client initialized successfully');
} else {
    logger.warn('⚠️ Twilio credentials not configured. WhatsApp sending will fail. Please update .env with your Twilio credentials.');
}

class WhatsAppService {

    /**
     * Format the Numer message with metadata
     * @param {Object} data - Numer data
     * @returns {string} Formatted WhatsApp message
     */
    formatMessage(data) {
        const { context, fromNumber, timestamp, location } = data;

        let message = '📱 New Numer\n\n';
        message += `Context: ${context}\n`;
        message += `From: ${fromNumber}\n`;
        message += `When: ${new Date(timestamp).toLocaleString()}\n`;

        if (location && location.lat && location.lng) {
            message += `Where: ${location.lat}, ${location.lng}\n`;
        }

        message += '\n---\nSent via Numer.me';

        return message;
    }

    /**
     * Send a single WhatsApp message via Twilio
     * @param {string} toNumber - Recipient phone number (E.164 format)
     * @param {string} messageBody - Message content
     * @returns {Promise<Object>} Send result
     */
    async sendMessage(toNumber, messageBody) {
        try {
            // Check if Twilio client is initialized
            if (!client) {
                logger.error('Twilio client not initialized. Please configure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
                return {
                    success: false,
                    error: 'Twilio credentials not configured',
                    code: 'TWILIO_NOT_CONFIGURED',
                    recipient: toNumber
                };
            }

            logger.info(`Sending WhatsApp to ${toNumber}`);

            const message = await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${toNumber}`,
                body: messageBody
            });

            logger.info(`✅ WhatsApp sent successfully`, {
                recipient: toNumber,
                sid: message.sid
            });

            return {
                success: true,
                sid: message.sid,
                status: message.status,
                recipient: toNumber
            };

        } catch (error) {
            logger.error(`❌ Twilio error for ${toNumber}:`, error);

            return {
                success: false,
                error: error.message,
                code: error.code,
                recipient: toNumber
            };
        }
    }

    /**
     * Send Numer to one or both parties
     * @param {Object} data - Numer request data
     * @returns {Promise<Array>} Array of send results
     */
    async sendNumer(data) {
        const { fromNumber, toNumber, sharedContext } = data;
        const message = this.formatMessage(data);

        const results = [];

        // Always send to recipient (To number)
        logger.info('Sending to recipient (To)');
        const toResult = await this.sendMessage(toNumber, message);
        results.push(toResult);

        // Send to sender (From number) if shared context enabled
        if (sharedContext) {
            logger.info('Sending to sender (From) - shared context enabled');
            const fromResult = await this.sendMessage(fromNumber, message);
            results.push(fromResult);
        }

        // Log summary
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        logger.info('Send summary', {
            total: results.length,
            success: successCount,
            failed: failCount
        });

        return results;
    }
}

export default new WhatsAppService();
