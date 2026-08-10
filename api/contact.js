/**
 * Vercel Serverless Function: Public Contact & Inquiry Intake
 * Endpoint: POST /api/contact
 */

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, topic, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required contact fields (name, email, message).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const sanitized = {
      name: String(name).replace(/[<>]/g, '').trim().slice(0, 100),
      email: String(email).trim().toLowerCase().slice(0, 150),
      topic: String(topic || 'General Inquiry').replace(/[<>]/g, '').trim().slice(0, 100),
      message: String(message).replace(/[<>]/g, '').trim().slice(0, 2000),
      timestamp: new Date().toISOString()
    };

    console.log('📨 Serverless Contact Inquiry Received:', sanitized.email, sanitized.topic);

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! The Zeerocodes engineering team will review your inquiry within 24 hours.',
      inquiryRef: 'ZC_INQ_' + Date.now().toString(36).toUpperCase()
    });
  } catch (error) {
    console.error('Contact endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
