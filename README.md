# Vital

An adult wellness dashboard with a signed-in health profile, BMI calculation, adaptive check-in suggestions, interactive educational body map, and beginner movement and strength guidance.

## Run

Requires Node.js 24. Run `npm ci` to install dependencies; configure Supabase as described below.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Run `npm test` for recommendation and BMI checks.

## Scope

Suggestions update from saved check-ins, not real-time sensors or clinical data. The body illustration cannot detect inflammation, infection, or disease. BMI is an adult screening measure, not a diagnosis; this version is not intended for children or pregnancy-specific guidance.

Profile data is stored in the configured Supabase database with a delete option and per-user access policies. Wearable integrations and clinical monitoring are not implemented. Sign out on shared devices. Google Fonts is optional; system fallback fonts work offline.

## Google sign-in and deployment

The app now requires Google sign-in through Supabase Auth. Profiles are saved in Supabase with row-level security, not browser-local health storage. Previous local profiles are not automatically uploaded. Auth tokens are managed by the Supabase SDK in the browser; signing out hides and clears the in-memory profile. This implementation needs a configured Supabase project before login can work.

1. Create a Supabase project. Run `supabase/schema.sql` once in its SQL Editor. The table policies permit authenticated users to read and change only their own profile. Never disable row-level security.
2. In Google Cloud, configure an OAuth consent screen and create an OAuth client of type **Web application**. Use the callback URL shown in Supabase's Google provider settings as the Google **Authorized redirect URI** (usually `https://<project-ref>.supabase.co/auth/v1/callback`). For a testing consent screen, add your Google email as a test user. Only basic identity scopes are requested.
3. In Supabase Authentication → Providers → Google, enable Google and enter the Google client ID and secret there. Never put the Google client secret into this repository or browser configuration.
4. Import this GitHub repository into Vercel as an Other framework project using Node.js 24. The included `vercel.json` sets the build and serverless routes. In Vercel's environment settings, add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from your Supabase project. The publishable key (or legacy anon key) is public; **never use a service-role key or secret key**. Redeploy after setting variables.
5. Set Supabase Authentication → URL Configuration → Site URL to your actual HTTPS site URL. Add that URL with a trailing `/` to allowed redirect URLs. For local development also allow `http://localhost:3000/`. Avoid wildcard production redirect URLs.
6. Test sign-in, profile save, reload, sign-out, and another Google account. Confirm each account sees only its own data. Actual Google OAuth and database policy enforcement must be verified against your configured project before inviting other users.

Local development after configuration:

```sh
npm ci
npm run build
# Set the two public configuration variables via your shell or an ignored .env file.
node --env-file=.env server.js
```

`npm start` automatically builds the authentication bundle and uses variables already in the process environment. `npm test` checks wellness logic and public configuration handling. The site stays on its sign-in screen when authentication is unconfigured; there is no guest bypass. Static application assets are public, while health data access is enforced by Supabase row-level security.

No site has been deployed or Google OAuth verified merely by committing this configuration. A Supabase project, Google OAuth setup, and Vercel deployment are required. This prototype is not a certified clinical records system.
