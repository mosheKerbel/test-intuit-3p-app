const express = require('express');
const { refreshTokens, isTokenValid } = require('../authClient');
const { getCompanyInfo, getCustomers, getInvoices, getAccounts, getProfitAndLoss } = require('../qboClient');

const router = express.Router();

// Middleware: ensure a valid token exists, refreshing if needed
async function requireAuth(req, res, next) {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated. Visit /auth/connect to authorize.' });
  }
  try {
    if (!isTokenValid(token)) {
      req.session.token = await refreshTokens(token);
    }
    next();
  } catch (err) {
    req.session.destroy();
    res.status(401).json({ error: 'Token refresh failed. Please re-authenticate at /auth/connect.' });
  }
}

router.get('/company', requireAuth, async (req, res) => {
  try {
    const data = await getCompanyInfo(req.session.token);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customers', requireAuth, async (req, res) => {
  try {
    const data = await getCustomers(req.session.token);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/invoices', requireAuth, async (req, res) => {
  try {
    const data = await getInvoices(req.session.token);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/accounts', requireAuth, async (req, res) => {
  try {
    const data = await getAccounts(req.session.token);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/pnl?start=2024-01-01&end=2024-12-31
router.get('/reports/pnl', requireAuth, async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: 'Query params "start" and "end" (YYYY-MM-DD) are required.' });
  }
  try {
    const data = await getProfitAndLoss(req.session.token, start, end);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
