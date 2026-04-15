const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const https = require('https');

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

exports.anthropicProxy = onRequest(
  { secrets: [ANTHROPIC_API_KEY], cors: true },
  (req, res) => {

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const bodyBuffer = Buffer.from(JSON.stringify(req.body), 'utf-8');

    const options = {
      hostname: 'api.anthropic.com',
      path:     '/v1/messages',
      method:   'POST',
      headers: {
        'Content-Type':      'application/json',
        'Content-Length':    bodyBuffer.length,
        'anthropic-version': '2023-06-01',
        'x-api-key':         ANTHROPIC_API_KEY.value()
      }
    };

    const proxyReq = https.request(options, proxyRes => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.status(proxyRes.statusCode).json(JSON.parse(data));
      });
    });

    proxyReq.on('error', err => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: err.message });
    });

    proxyReq.write(bodyBuffer);
    proxyReq.end();
  }
);