# MantraVanni Storefront

React 19 + Vite + Tailwind CSS 4 storefront for the MantraVanni store (spiritual essentials). It talks to the
multi-tenant commerce API; the tenant is resolved by the backend from the request `Origin`.

## Stack
React, React Router 7 (route-level lazy loading), TanStack Query, Redux Toolkit + redux-persist (cart only),
Axios, react-hot-toast, Tailwind CSS, Firebase Auth (Google sign-in), Razorpay Checkout.

## Setup
```bash
npm ci
cp .env.example .env.local   # fill in the values (see below)
npm run dev                  # http://localhost:5173
npm run build                # production build in dist/
npm run lint
```

## Environment variables
See `.env.example` for every `VITE_*` variable (names and placeholders only). Notable points:
- Firebase web keys are public identifiers; restrict the API key by HTTP referrer in Google Cloud.
- The Razorpay public key id is returned by the API at checkout. Never place a Razorpay secret in a `VITE_*` var.
- `VITE_TENANT_ID` is a DEV-only override for localhost; production builds never send a tenant header.
- Store name / support email / phone / address / social links come from the tenant's public settings, with optional
  `VITE_STORE_*` / `VITE_SOCIAL_*` fallbacks.

## Checkout and pricing
The server is the source of truth for prices, coupon discount, shipping and total. Checkout calls
`POST /orders/quote`, shows the server numbers, blocks payment when the quote reports `issues`, and handles
`409 OUT_OF_STOCK`. The client never sends prices or totals.

## Authentication storage
The httpOnly cookie is the primary credential. A Bearer fallback token (for browsers that block third-party
cookies) is kept in `sessionStorage`. Personal data is not persisted by redux-persist.

## Legal pages
Privacy, Terms, Cancellation & Refund and Shipping policies live in `src/pages/legal`. They are generic templates and
must be reviewed by a lawyer and adapted before go-live.

## Deployment (GitHub Actions)
`.github/workflows/ci-cd.yml` builds every pull request and, on pushes to `main`, builds and deploys over SSH.
Required repository secrets:

| Secret | Purpose |
| --- | --- |
| `SSH_PRIVATE_KEY` | Private key of the deploy user |
| `DEPLOY_USER` | SSH user on the server |
| `DEPLOY_HOST` | Server host name or IP |
| `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keyscan -H <host>` (host key pinning, no StrictHostKeyChecking=no) |
| `DEPLOY_PATH` | Directory on the server that serves the built site |
| `DEPLOY_RESTART_CMD` | Optional command run after upload (for example reloading the web server) |

## SEO note
The app is a client-rendered SPA. `usePageMeta` sets title, description, canonical, Open Graph and JSON-LD at runtime,
but crawlers that do not run JavaScript only see the defaults in `index.html`. Prerendering or SSR is the follow-up.
