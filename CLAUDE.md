# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Express.js app that integrates with the **QuickBooks Online (QBO) API** via Intuit's OAuth 2.0 flow and the `node-quickbooks` SDK.

Package manager: **npm** | Registry: public (`registry.npmjs.org` via `.npmrc`)

## Commands

```bash
npm install      # Install dependencies
npm start        # Start server (node src/index.js)
npm run dev      # Start with nodemon (auto-reload)
```

## Setup

1. Copy `.env.example` to `.env` and fill in your Intuit app credentials from https://developer.intuit.com/app/developer/dashboard
2. Set `REDIRECT_URI=http://localhost:3000/callback` in both `.env` and your Intuit app's redirect URIs list
3. Run `npm run dev` then visit `http://localhost:3000/auth/connect` to authorize

## Architecture

```
src/
  index.js          — Express app setup, session middleware, route mounting
  authClient.js     — intuit-oauth wrapper: getAuthUri, exchangeCode, refreshTokens, isTokenValid
  qboClient.js      — node-quickbooks wrapper: all API calls, promisified
  routes/
    auth.js         — GET /auth/connect, /auth/callback, /auth/disconnect
    api.js          — GET /api/company, /api/customers, /api/invoices, /api/accounts, /api/reports/pnl
```

### Auth flow
`/auth/connect` → redirects to Intuit → Intuit redirects to `/auth/callback` → token stored in `req.session.token` → all `/api/*` routes check and auto-refresh the token via `requireAuth` middleware.

### Environment values
| Variable | Purpose |
|---|---|
| `INTUIT_CLIENT_ID` / `INTUIT_CLIENT_SECRET` | App credentials from Intuit Developer Dashboard |
| `REDIRECT_URI` | Must match the registered redirect URI exactly |
| `ENVIRONMENT` | `sandbox` (default) or `production` |
| `SESSION_SECRET` | Express session signing key |
| `PORT` | Server port (default `3000`) |

### Key packages
- `intuit-oauth` — OAuth 2.0 PKCE flow with Intuit
- `node-quickbooks` — QBO REST API client (callback-style, wrapped in Promises in `qboClient.js`)
- `express-session` — stores OAuth tokens server-side per session
