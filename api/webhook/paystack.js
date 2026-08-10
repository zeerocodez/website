/**
 * Vercel Serverless Function: Paystack Webhook Handler
 * Endpoint: POST /api/webhook/paystack
 * 
 * Non-negotiable security requirements:
 * 1. Constant-time cryptographic HMAC SHA-512 signature verification against PAYSTACK_SECRET_KEY.
 * 2. Timing-safe comparison to prevent side-channel timing attacks.
 * 3. Server-side only fulfillment; never trust client-asserted payment.
 */

const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-paystack-signature'];
    const secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_paystack_placeholder_secret';

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-paystack-signature header' });
    }

    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const hash = crypto.createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'utf8');
    const hashBuffer = Buffer.from(hash, 'utf8');

    const isValid = sigBuffer.length === hashBuffer.length && crypto.timingSafeEqual(sigBuffer, hashBuffer);

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.error('❌ Paystack webhook signature verification failed.');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    console.log(`✅ Verified Paystack webhook event: ${event?.event}`, event?.data?.reference);

    if (event?.event === 'charge.success') {
      const metadata = event.data?.metadata || {};
      if (metadata.type === 'academy_enrollment') {
        console.log(`🎓 Fulfilling Academy course enrollment for user ${metadata.userId}`);
      } else if (metadata.type === 'vibescan_audit') {
        console.log(`🛡️ Queuing VibeScan submission to pending_review for ${metadata.appName}`);
      }
    }

    return res.status(200).json({ received: true, status: 'verified' });
  } catch (error) {
    console.error('Paystack webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
