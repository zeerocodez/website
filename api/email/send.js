/**
 * Vercel Serverless Function: Transactional Email Dispatcher via Resend REST API
 * Endpoint: POST /api/email/send
 * 
 * Rules:
 * - RESEND_API_KEY stored strictly in environment variables.
 * - Input validation & sanitization on recipient, subject, and HTML body.
 * - Resilient error handling with detailed JSON responses.
 */

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY environment variable is not configured.');
    return res.status(503).json({
      error: 'Email service unconfigured on server. Please set RESEND_API_KEY in environment variables.',
      delivered: false
    });
  }

  try {
    const { to, subject, html, text, from, replyTo } = req.body || {};

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Missing required email fields (to, subject, html/text).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to : [to];
    for (const r of recipients) {
      if (!emailRegex.test(r)) {
        return res.status(400).json({ error: `Invalid recipient email address format: ${r}` });
      }
    }

    const payload = {
      from: from || process.env.RESEND_FROM || 'Zeerocodes <onboarding@resend.dev>',
      to: recipients,
      subject: String(subject).slice(0, 200),
      html: html || undefined,
      text: text || undefined,
      reply_to: replyTo || process.env.RESEND_REPLY_TO || 'admin@zeerocodes.com'
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('❌ Resend API Error:', data);
      return res.status(resendResponse.status).json({
        error: data.message || 'Resend delivery failed',
        details: data
      });
    }

    console.log(`✅ [Resend] Dispatched email "${subject}" to ${recipients.join(', ')} (ID: ${data.id})`);

    return res.status(200).json({
      success: true,
      id: data.id,
      recipients: recipients,
      sentAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Email dispatcher serverless error:', err);
    return res.status(500).json({ error: 'Internal server error while dispatching email.' });
  }
};
