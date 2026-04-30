const express = require('express');

const router = express.Router();

router.get('/eula', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>End-User License Agreement</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}</style>
</head>
<body>
<h1>End-User License Agreement</h1>
<p><strong>Last updated:</strong> ${new Date().toISOString().split('T')[0]}</p>

<p>This End-User License Agreement ("Agreement") is a legal agreement between you ("User") and the operator of this application ("App") for use of this QuickBooks Online integration application.</p>

<h2>1. License Grant</h2>
<p>Subject to the terms of this Agreement, you are granted a limited, non-exclusive, non-transferable license to use this App solely for your internal business purposes.</p>

<h2>2. Restrictions</h2>
<p>You may not reverse engineer, decompile, resell, or redistribute this App or its outputs.</p>

<h2>3. QuickBooks Data</h2>
<p>This App accesses your QuickBooks Online data only with your explicit authorization via Intuit's OAuth 2.0 flow. Access may be revoked at any time from your Intuit account settings.</p>

<h2>4. Disclaimer of Warranties</h2>
<p>This App is provided "as is" without warranty of any kind. Use at your own risk.</p>

<h2>5. Limitation of Liability</h2>
<p>The operator shall not be liable for any indirect, incidental, or consequential damages arising from your use of this App.</p>

<h2>6. Termination</h2>
<p>This Agreement is effective until terminated. Your rights terminate automatically if you breach any term of this Agreement.</p>

<h2>7. Contact</h2>
<p>For questions about this Agreement, contact the app operator.</p>
</body>
</html>`);
});

router.get('/privacy', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Privacy Policy</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}</style>
</head>
<body>
<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> ${new Date().toISOString().split('T')[0]}</p>

<p>This Privacy Policy describes how this QuickBooks Online integration application ("App") handles your information.</p>

<h2>1. Information We Access</h2>
<p>With your explicit authorization, this App accesses QuickBooks Online data including: company information, customers, invoices, accounts, and financial reports. This data is accessed solely to provide the App's functionality.</p>

<h2>2. How We Use Your Information</h2>
<p>Accessed data is used only to respond to your requests within the App. We do not sell, share, or store your QuickBooks data beyond what is required to serve your current session.</p>

<h2>3. Data Storage</h2>
<p>OAuth tokens are stored in a server-side session and expire automatically. No QuickBooks financial data is persisted to disk or a database.</p>

<h2>4. Third-Party Services</h2>
<p>This App uses Intuit's OAuth 2.0 service for authentication. Your use is also subject to <a href="https://www.intuit.com/privacy/statement/">Intuit's Privacy Statement</a>.</p>

<h2>5. Revoking Access</h2>
<p>You may revoke this App's access to your QuickBooks data at any time via your <a href="https://accounts.intuit.com/app/account-manager/security">Intuit account security settings</a>.</p>

<h2>6. Contact</h2>
<p>For privacy-related questions, contact the app operator.</p>
</body>
</html>`);
});

module.exports = router;
