require('dotenv').config();
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const legalRoutes = require('./routes/legal');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true behind HTTPS in production
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Intuit QBO Third-Party App',
    endpoints: {
      connect:    'GET /auth/connect       — start OAuth flow',
      disconnect: 'GET /auth/disconnect    — revoke session',
      company:    'GET /api/company        — company info',
      customers:  'GET /api/customers      — list customers',
      invoices:   'GET /api/invoices       — list invoices',
      accounts:   'GET /api/accounts       — chart of accounts',
      pnl:        'GET /api/reports/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD',
      batch_ui:   'GET /batch.html          — batch invoice import UI',
      eula:       'GET /legal/eula          — end-user license agreement',
      privacy:    'GET /legal/privacy       — privacy policy',
    },
  });
});

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/legal', legalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Start OAuth flow: http://localhost:${PORT}/auth/connect`);
});
