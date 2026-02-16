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
     * @param {string} recipientType - 'recipient' or 'sender'
     * @returns {string} Formatted WhatsApp message
     */
    formatMessage(data, recipientType = 'recipient') {
        const { context, fromNumber, toNumber, timestamp, location, sharedContext } = data;

        // Header / Intro based on recipient type
        // Recipient always gets "You received a Numer"
        // Sender gets "You created a Numer"
        let introLine = 'You received a Numer';
        let numberDisplay = `From: ${fromNumber}`;

        if (recipientType === 'sender') {
            introLine = 'You sent Numer';
            numberDisplay = `To: ${toNumber}`;
        }

        // Format Date: "February 17, 2026 at 2:19 AM"
        let formattedDate;
        try {
            const dateObj = new Date(timestamp);
            const datePart = dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            const timePart = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            formattedDate = `${datePart} at ${timePart}`;
        } catch (e) {
            formattedDate = new Date(timestamp).toLocaleString();
        }

        // Determine Mode string
        const modeString = sharedContext ? 'Shared Context' : 'One-Way Context';

        // Build Message
        // 1. Header
        let message = ``;

        // 2. Intro
        message += `${introLine}\n\n`;

        // 3. Context
        message += `Context: ${context}\n\n`;

        // 4. Details
        message += `${numberDisplay}\n`;
        message += `Date: ${formattedDate}\n`;




        // 5. Location
        if (location && location.lat && location.lng) {
            const mapLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
            message += `Location: View on Map\n${mapLink}\n`;
        }
        // 6. Mode
        message += `Mode: ${modeString}\n`;
        // 7. Footer
        message += '\n— Sent via Numer me';

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

        const results = [];

        // 1. Always send to Sender (From number) - "You created a Numer"
        // In one-way mode, this is the only message sent.
        const senderMessage = this.formatMessage(data, 'sender');
        logger.info('Sending to sender (From)');
        const fromResult = await this.sendMessage(fromNumber, senderMessage);
        results.push(fromResult);

        // 2. Send to Recipient (To number) ONLY if shared context enabled
        if (sharedContext) {
            const recipientMessage = this.formatMessage(data, 'recipient');
            logger.info('Sending to recipient (To) - shared context enabled');
            const toResult = await this.sendMessage(toNumber, recipientMessage);
            results.push(toResult);
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
