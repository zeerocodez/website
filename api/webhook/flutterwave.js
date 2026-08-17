/**
 * Vercel Serverless Function: Flutterwave Webhook Handler
 * Endpoint: POST /api/webhook/flutterwave
 * 
 * Non-negotiable security requirements:
 * 1. Constant-time cryptographic verification of the verif-hash header.
 * 2. Timing-safe comparison to prevent side-channel timing attacks.
 */

const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['verif-hash'];
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET || process.env.FLUTTERWAVE_SECRET_KEY || 'flw_webhook_hash_secret';

    if (!signature) {
      return res.status(400).json({ error: 'Missing verif-hash header' });
    }

    const sigBuffer = Buffer.from(signature, 'utf8');
    const secretBuffer = Buffer.from(secretHash, 'utf8');

    const isValid = sigBuffer.length === secretBuffer.length && crypto.timingSafeEqual(sigBuffer, secretBuffer);

    if (!isValid) {
      console.error('❌ Flutterwave webhook signature mismatch.');
      return res.status(401).json({ error: 'Invalid verification hash' });
    }

    const event = req.body;
    console.log('✅ Verified Flutterwave webhook event:', event?.event, event?.data?.id);

    return res.status(200).json({ received: true, status: 'verified' });
  } catch (error) {
    console.error('Flutterwave webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
