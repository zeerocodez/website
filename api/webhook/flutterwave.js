/**
 * Vercel Serverless Function: Flutterwave Webhook Handler
 * Endpoint: POST /api/webhook/flutterwave
 */

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['verif-hash'];
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET || process.env.FLUTTERWAVE_SECRET_KEY || 'flw_webhook_hash_secret';

    if (!signature || (signature !== secretHash && process.env.NODE_ENV === 'production')) {
      console.error('❌ Flutterwave webhook signature mismatch.');
      return res.status(401).json({ error: 'Invalid verification hash' });
    }

    const event = req.body;
    console.log('✅ Flutterwave webhook verified:', event.event, event.data?.id);

    return res.status(200).json({ received: true, status: 'verified' });
  } catch (error) {
    console.error('Flutterwave webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
