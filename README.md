# cap-event-ui

Next.js frontend for CAP events (React 19, MUI, MobX, AG Grid). OpenAPI specs live in `src/api/openapi`;
typed clients are generated into `src/clients` with `npm run generate:api`.

# Setup dev environment

- Prerequisites: Node.js >= 20

- Authenticate to GitHub Packages (the UI library `@oleg-irchishyn/irchishyn-ui-library` is published there).
  Create a GitHub PAT (classic) with `read:packages` and export it (`.npmrc` reads `${NODE_AUTH_TOKEN}`):

  ```powershell
  [Environment]::SetEnvironmentVariable("NODE_AUTH_TOKEN", "<your token>", "User")   # then reopen the terminal
  ```

- Install Dependencies

  ```
  npm install
  ```

- Prepare env file:

  ```
  cp .env.template .env
  ```

- run `next dev` for local development
