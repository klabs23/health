# Vital

An adult wellness dashboard with a browser-local health profile, BMI calculation, adaptive check-in suggestions, interactive educational body map, and beginner movement and strength guidance.

## Run

Requires Node.js 24. No packages or secrets are required.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Run `npm test` for recommendation and BMI checks.

## Scope

Suggestions update from saved check-ins, not real-time sensors or clinical data. The body illustration cannot detect inflammation, infection, or disease. BMI is an adult screening measure, not a diagnosis; this version is not intended for children or pregnancy-specific guidance.

Profile data is stored in localStorage in the current browser, with a delete option. This prototype has no accounts, backend health records, wearable integrations, cloud synchronization, or clinical monitoring. Avoid sensitive records on shared devices. Google Fonts is optional; system fallback fonts work offline.
