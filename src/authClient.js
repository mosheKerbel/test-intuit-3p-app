const OAuthClient = require('intuit-oauth');

let oauthClient = null;

function getOAuthClient() {
  if (!oauthClient) {
    oauthClient = new OAuthClient({
      clientId: process.env.INTUIT_CLIENT_ID,
      clientSecret: process.env.INTUIT_CLIENT_SECRET,
      environment: process.env.ENVIRONMENT || 'sandbox',
      redirectUri: process.env.REDIRECT_URI,
    });
  }
  return oauthClient;
}

function getAuthUri() {
  return getOAuthClient().authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId, OAuthClient.scopes.Profile, OAuthClient.scopes.Email],
    state: 'intuit-state',
  });
}

async function exchangeCode(url) {
  const client = getOAuthClient();
  const authResponse = await client.createToken(url);
  return authResponse.getJson();
}

async function refreshTokens(token) {
  const client = getOAuthClient();
  client.setToken(token);
  const authResponse = await client.refresh();
  return authResponse.getJson();
}

function isTokenValid(token) {
  const client = getOAuthClient();
  client.setToken(token);
  return client.isAccessTokenValid();
}

module.exports = { getOAuthClient, getAuthUri, exchangeCode, refreshTokens, isTokenValid };
