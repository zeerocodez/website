/**
 * Vercel Serverless Function: Public Configuration Endpoint
 * Endpoint: GET /api/config
 * 
 * Safely exposes only public, non-sensitive client configuration parameters.
 * Secret keys (PAYSTACK_SECRET_KEY, RESEND_API_KEY, etc.) are strictly kept server-side.
 */

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Set Cache-Control for high edge performance
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  return res.status(200).json({
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    flutterwavePublicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
    environment: process.env.NODE_ENV || 'production',
    service: 'Zeerocodes Serverless Edge',
    version: '2.5.0'
  });
};
