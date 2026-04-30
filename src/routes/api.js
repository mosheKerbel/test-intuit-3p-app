const express = require('express');
const { refreshTokens, isTokenValid } = require('../authClient');
const { getCompanyInfo, getCustomers, getInvoices, getAccounts, getProfitAndLoss, createInvoice, createInvoicesBatch } = require('../qboClient');

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

// POST /api/invoices
// Body: a single invoice object { CustomerRef, Line, ... }
router.post('/invoices', requireAuth, async (req, res) => {
  if (!req.body?.CustomerRef || !req.body?.Line) {
    return res.status(400).json({ error: 'Body must include "CustomerRef" and "Line".' });
  }
  try {
    const data = await createInvoice(req.session.token, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices/batch
// Body: array of invoice objects [{ CustomerRef, Line, ... }, ...]
router.post('/invoices/batch', requireAuth, async (req, res) => {
  const invoices = req.body;
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return res.status(400).json({ error: 'Body must be a non-empty array of invoice objects.' });
  }
  try {
    const results = await createInvoicesBatch(req.session.token, invoices);
    const failed = results.filter((r) => !r.success);
    res.status(failed.length === 0 ? 201 : 207).json({
      total: invoices.length,
      succeeded: results.length - failed.length,
      failed: failed.length,
      results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
