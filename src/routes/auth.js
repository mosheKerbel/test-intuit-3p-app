const express = require('express');
const { getAuthUri, exchangeCode } = require('../authClient');

const router = express.Router();

router.get('/connect', (req, res) => {
  const authUri = getAuthUri();
  res.redirect(authUri);
});

router.get('/callback', async (req, res) => {
  try {
    const token = await exchangeCode(req.url);
    // realmId comes from the query string Intuit appends
    token.realmId = req.query.realmId;
    req.session.token = token;
    res.redirect('/api/company');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
});

router.get('/disconnect', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Disconnected' });
});

module.exports = router;
