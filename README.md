# CAP Event — UI

Frontend for **CAP events**, built with [Next.js](https://nextjs.org) (App Router, React 19), [MUI](https://mui.com), [styled-components](https://styled-components.com), [MobX](https://mobx.js.org) and [AG Grid](https://www.ag-grid.com), on top of the private UI library `@oleg-irchishyn/irchishyn-ui-library`. Talks to a REST backend through typed [axios](https://axios-http.com) clients generated from the OpenAPI specs in `src/api/openapi`. Sign-in goes through OneLogin (OIDC Authorization Code + PKCE); locally the provider is the fake one from the sibling [cap-event-microservices](https://github.com/Oleg-Irchishyn/cap-event-microservices) repo. Unit tests: Jest + React Testing Library.

## Local setup

Authenticate to GitHub Packages first (the UI library is published there). Create a GitHub PAT (classic) with `read:packages` and export it; `.npmrc` reads `${NODE_AUTH_TOKEN}`:

```powershell
[Environment]::SetEnvironmentVariable("NODE_AUTH_TOKEN", "<your token>", "User")   # then reopen the terminal
```

```bash
git clone git@github.com:Oleg-Irchishyn/cap-event-ui.git
cd cap-event-ui
npm install
cp .env.template .env   # see Environment variables below
npm run dev             # http://localhost:3000/cap-event
```

Requires Node.js 20+ (24.5 works too) and the PAT above. The app is served under `NEXT_PUBLIC_BASE_PATH`, so with the default `/cap-event` the root is `http://localhost:3000/cap-event`. Every route except `/login` and `/auth/callback` needs a session, so for real data run the fake login provider (see [Login](#login)) or use the [dev-only bypass](#skipping-login-dev-only).

## Environment variables

All variables are read at build/dev-server start. They are `NEXT_PUBLIC_*`, so Next.js **inlines them into the browser bundle**: never put secrets, database URLs or credentials in them, and don't paste any such value into `.env.template` (it is committed).

| Variable | Purpose | Local value |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Next.js `basePath` the app is served under | `/cap-event` |
| `NEXT_PUBLIC_HOSTNAME` | Backend origin; prefix of every API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_BASE_URL` | API version prefix, appended to the hostname | `/api/v1` |
| `NEXT_PUBLIC_CAP_EVENT_PACKAGE_API` | Path of the cap-event-package API | `/cap-event-package` |
| `NEXT_PUBLIC_REFERENCE_DATA_API` | Path of the reference-data API | `/reference-data` |
| `NEXT_PUBLIC_TEMPLATE_LIBRARY_API` | Path of the template-library API | `/template-library` |
| `NEXT_PUBLIC_BOX_CONNECTOR_API` | Path of the box-connector API | `/box-connector` |
| `NEXT_PUBLIC_INTACCT_HOSTNAME` | Intacct host | `https://www-p07.intacct.com` |
| `NEXT_PUBLIC_ONELOGIN_BASE_URL` | Overrides the whole OIDC host, which is otherwise `https://<subdomain>.onelogin.com` (`.eu` when `NEXT_PUBLIC_ONELOGIN_REGION=eu`). Set it to use the local fake provider | `http://localhost:4000` |
| `NEXT_PUBLIC_ONELOGIN_SUBDOMAIN` | OneLogin subdomain. Required unless `NEXT_PUBLIC_ONELOGIN_BASE_URL` is set; when it is set, any value works (e.g. `local`) | `local` |
| `NEXT_PUBLIC_ONELOGIN_CLIENT_ID` | OIDC `client_id`; must match the provider's allowed client | `cap-event-ui` |
| `NEXT_PUBLIC_ONELOGIN_REDIRECT_URI` | Callback URL; must match the provider's allow-list exactly | `http://localhost:3000/cap-event/auth/callback` |
| `NEXT_PUBLIC_ONELOGIN_RESOURCE` | `resource` parameter sent in the auth request | `http://localhost:4000` |
| `NEXT_PUBLIC_ONELOGIN_SCOPE` | Custom scope appended to `openid profile email` | `custom:capevent` |
| `NEXT_PUBLIC_ONELOGIN_REGION` | Optional, `us` (default) or `eu`; ignored when the base URL override is set | unset |
| `NEXT_PUBLIC_AUTH_DISABLED` | Optional dev-only switch, see [below](#skipping-login-dev-only) | unset |

Missing OneLogin client id, redirect URI, scope or resource (or both subdomain and base URL) makes `getOneLoginConfig()` throw, and the login page then only logs the error.

## Login

The UI implements OIDC **Authorization Code + PKCE** itself, with no auth library:

1. Opening a protected route without a valid token redirects to `/login` (`src/app/layout.tsx`). `/login` first tries to get a valid token; if there is none it generates a random `state` and a PKCE verifier, stores both in `sessionStorage`, and redirects to `<provider>/oidc/2/auth` with `response_type=code`, `scope=openid profile email <scope>`, `state` and an S256 `code_challenge` (`src/utils/oneloginAuth.ts`). `?prompt_login=true` (set after logout) adds `prompt=login`.
2. The provider authenticates the user and redirects to `/auth/callback?code=...&state=...`.
3. The callback page rejects the request if `state` doesn't match the stored one, then POSTs the code and the verifier to `<provider>/oidc/2/token`.
4. Access, refresh and ID tokens plus the expiry are kept in `sessionStorage` (`src/utils/tokenStorage.ts`), so they are dropped when the browser session ends. The user lands on `/`.
5. Every request made through the axios instances in `src/api/index.ts` gets `Authorization: Bearer <token>` from a request interceptor (plus `Session-Id` when present).
6. The token is refreshed automatically with the refresh token when it is expired or within 5 minutes of expiry; concurrent calls share one refresh. If refresh fails the tokens are cleared and the user is sent back to `/login`.
7. Logout (`src/utils/logout.ts`) clears the stored tokens and session id, then navigates to `<provider>/oidc/2/logout` with `id_token_hint` and a `post_logout_redirect_uri` back to `/cap-event/login?prompt_login=true`.

### Local login provider

Locally the provider is a fake OneLogin in [cap-event-microservices](https://github.com/Oleg-Irchishyn/cap-event-microservices): an `api-gateway` on `:4000` (serves `/oidc/2/*`) and an `auth-service` on `:4001`, backed by MongoDB. Its README has the details; short version:

```bash
git clone git@github.com:Oleg-Irchishyn/cap-event-microservices.git
cd cap-event-microservices
npm run install:all     # then create api-gateway/.env and auth-service/.env from the .env.example files (auth-service needs MONGO_URI)
npm run start:auth      # terminal 1, auth-service :4001
npm run start:gateway   # terminal 2, api-gateway :4000
```

Then `npm run dev` here and open `http://localhost:3000/cap-event`. Sign in with the local demo user `demo@cap-event.local` / `Demo12345!` (seeded on startup by that service's `auth-service/.env` via `SEED_USER_*`), or create an account on the login form.

The gateway's `CLIENT_ID`, `CLIENT_URL` and `ALLOWED_REDIRECT_URIS` must match `NEXT_PUBLIC_ONELOGIN_CLIENT_ID`, the UI origin and `NEXT_PUBLIC_ONELOGIN_REDIRECT_URI`, otherwise the provider rejects the auth request or CORS blocks the token call.

Only the auth endpoints exist in the microservices so far. The other API calls (`/api/v1/cap-event-package`, reference data, ...) are not implemented there yet, so after login those requests return 404.

### Skipping login (dev only)

Set `NEXT_PUBLIC_AUTH_DISABLED=true` in `.env` to skip the token check in the root layout. It is only honoured when `NODE_ENV !== 'production'`, so `next build` / `next start` ignore it. API calls then go out without a Bearer token.

## Commands

```bash
npm run dev                  # dev server, http://localhost:3000/cap-event
npm run build && npm start   # production build (output: 'standalone')
npm run lint / lint:fix      # ESLint / ESLint with auto-fix
npm run test / test:watch    # Jest, single run / watch mode
npm run test:ci              # Jest in CI mode with coverage
npm run generate:api         # regenerate src/clients from src/api/openapi
```

`generate:api` runs `scripts/generate-apis.ts` with plain `node` (so it needs a Node version that runs `.ts` files natively, e.g. 24.5) and calls `@openapitools/openapi-generator-cli` (`typescript-axios`) via `npx` for each spec: Common, ReferenceData, CapEventPackage, TemplateLibrary and BoxConnector. It deletes and recreates each folder in `src/clients`, so never edit generated files by hand. The generator CLI downloads and runs the OpenAPI Generator jar, which needs Java on `PATH`.

## OpenAPI and clients

The specs in `src/api/openapi` are the contract with the backend (originally Java); generated clients land in `src/clients` and are wired up with auth interceptors in `src/api/index.ts`. The backend is planned to move to Node.js ([cap-event-microservices](https://github.com/Oleg-Irchishyn/cap-event-microservices)), at which point the specs are expected to come from its OpenAPI output instead of being maintained here.

## Project structure

```
src/
  app/          # App Router pages: / , /new, /preview-screen, /login, /auth/callback, shared components
  api/          # axios instances + OpenAPI specs (api/openapi)
  clients/      # generated API clients (npm run generate:api)
  const/        # routes and other constants
  hooks/ lib/   # React hooks, styled-components registry
  providers/    # app-level providers (toasts)
  stores/       # MobX stores (RootStore and friends)
  ui/           # theme, fonts, global styles
  utils/        # OneLogin helpers, token storage, logout, session id
scripts/        # generate-apis.ts
```

## UI library

Shared components come from `@oleg-irchishyn/irchishyn-ui-library` (GitHub Packages, see [Local setup](#local-setup)). `src/app/layout.tsx` wraps the app in `IrchishynThemeProvider` with `cssBaseline={false}`, inside the styled-components `ThemeProvider`, so the library doesn't inject its own CSS baseline. Components are imported directly, e.g. `ActionButton` in `src/app/components/CancelButton/CancelButton.tsx`:

```tsx
import { ActionButton } from '@oleg-irchishyn/irchishyn-ui-library';

<ActionButton variant="secondary" label="Cancel" disabled={isFormClean} onClick={onOpenConfirmationModal} />
```

## Testing

Unit tests use [Jest](https://jestjs.io) with `jest-environment-jsdom` and React Testing Library (`jest.config.ts`, `jest.setup.ts`; timezone is pinned to UTC). Specs live next to the code in `__tests__` folders, e.g. `src/app/components/CancelButton/__tests__/CancelButton.spec.tsx`.

```bash
npm run test -- CancelButton   # run matching specs only
```
