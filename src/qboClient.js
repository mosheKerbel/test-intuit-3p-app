const QuickBooks = require('node-quickbooks');

function createQboClient(token) {
  const isSandbox = (process.env.ENVIRONMENT || 'sandbox') === 'sandbox';

  return new QuickBooks(
    process.env.INTUIT_CLIENT_ID,
    process.env.INTUIT_CLIENT_SECRET,
    token.access_token,
    false,           // no token secret (OAuth 2.0)
    token.realmId,
    isSandbox,       // use sandbox endpoint
    false,           // enable debugging
    null,            // minor version
    '2.0',           // OAuth version
    token.refresh_token
  );
}

// Wrap node-quickbooks callback-style methods as Promises
function promisify(qbo, method, ...args) {
  return new Promise((resolve, reject) => {
    qbo[method](...args, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function getCompanyInfo(token) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'getCompanyInfo', token.realmId);
}

async function getCustomers(token) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'findCustomers', []);
}

async function getInvoices(token) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'findInvoices', []);
}

async function getAccounts(token) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'findAccounts', []);
}

async function getProfitAndLoss(token, startDate, endDate) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'reportProfitAndLoss', {
    start_date: startDate,
    end_date: endDate,
  });
}

// Create a single invoice. invoiceData must include CustomerRef and Lines.
async function createInvoice(token, invoiceData) {
  const qbo = createQboClient(token);
  return promisify(qbo, 'createInvoice', invoiceData);
}

// Create multiple invoices sequentially, collecting results and errors per item.
async function createInvoicesBatch(token, invoices) {
  const qbo = createQboClient(token);
  const results = await Promise.allSettled(
    invoices.map((invoice) =>
      promisify(qbo, 'createInvoice', invoice)
    )
  );
  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? { index: i, success: true, invoice: r.value }
      : { index: i, success: false, error: r.reason?.message || r.reason }
  );
}

module.exports = { getCompanyInfo, getCustomers, getInvoices, getAccounts, getProfitAndLoss, createInvoice, createInvoicesBatch };
