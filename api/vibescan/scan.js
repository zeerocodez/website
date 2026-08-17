/**
 * Vercel Serverless Function: VibeScan AST & AgentGuard Scanner Dispatcher
 * Endpoint: POST /api/vibescan/scan
 */

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { url, repoUrl } = req.body || {};
  const target = url || repoUrl;

  if (!target) {
    return res.status(400).json({ error: 'Missing target GitHub repository URL or live web application URL.' });
  }

  // Validate GitHub URL format
  if (!target.startsWith('https://github.com/') && !target.startsWith('http://') && !target.startsWith('https://')) {
    return res.status(400).json({ error: 'Invalid URL format. Provide a valid https://github.com/... or web URL.' });
  }

  try {
    const jobId = 'scan_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    
    return res.status(200).json({
      success: true,
      jobId,
      status: 'QUEUED',
      target,
      scannerEngine: 'VibeScan SAST/DAST v2.5 (AST Rules + AgentGuard)',
      pollUrl: `/api/vibescan/status?jobId=${jobId}`,
      queuedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('VibeScan proxy error:', err.message);
    return res.status(500).json({ error: 'Failed to queue VibeScan security job.' });
  }
};
