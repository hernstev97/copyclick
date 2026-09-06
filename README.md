# CopyClick

A minimalist React application that lets you paste text once and copy it with a single click.

![Preview of CopyClick](screenshot.png 'CopyClick website')

[CopyClick](https://copyclick.hellofrom.sh/) keeps snippets in this browser's local storage. Its existing layout, colors, typography, and animations are preserved in the maintenance refresh.

## Features

- Paste into an editable snippet to switch automatically to copy mode. Plain text, including code and HTML, is preserved instead of interpreted as markup.
- Click a read-only snippet to copy it, or focus it and press Enter / Space. The Edit checkbox switches back to editing.
- Drag the existing handle with a mouse or touch. Focus the handle and press Enter / Space to activate keyboard reordering, then use Arrow Up / Arrow Down to move. Enter, Space, Escape or moving focus away finishes reordering.
- Export a versioned JSON backup. Import is available when the list is empty and accepts both the original array exports and the current envelope. Import validates the entire file before applying it, rejects duplicate IDs, and creates new IDs. Limits: 10 MiB and 1000 snippets per import.
- Existing language (English/German), theme preference, snippet order, text, and edit state remain supported. An explicit theme takes precedence over the system theme.
- Invalid saved data is retained, with a recovery download. If storage is blocked/full, edits remain usable in memory and can be exported. Another tab's changed data is detected before overwriting a stale snapshot. The warning offers explicit replacement after confirmation; reload to load another tab's data.
- Information dialog supports Escape, focus trapping and focus restoration.

## Development and verification

Use Node.js 24 LTS (see `.nvmrc`); Node 22.13+ is also supported by the declared engine range. npm is retained as the repository's package manager.

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
npm run check             # strict lint, unit tests, TypeScript, production build
npx playwright install chromium firefox
npm run test:e2e          # production artifacts: desktop Chromium, mobile Chromium, Firefox
npm audit
npm run preview
```

The E2E suite owns `127.0.0.1:5196`, builds the application, and serves `dist/` with the headers from `vercel.json`. It does not stop other servers. On Linux, Playwright may require system libraries (`npx playwright install --with-deps chromium firefox`). Real clipboard permission automation is tested in Chromium; that single test is skipped in Firefox. The other Firefox flows run normally.

The application uses React 19, Vite 8, Motion 13, TypeScript 6.0, and Sass modules. TypeScript is intentionally held at the latest 6.0 patch because the current TypeScript-ESLint peer range is `>=4.8.4 <6.1.0`. `@types/node` stays on Node 24 to match the runtime. All other retained direct packages were brought to their stable latest versions at the refresh date. The Vite React plugin now uses Vite 8's Oxc path; unused DOMPurify/types and UUID dependencies were removed.

## Storage and security boundaries

- Snippets are unencrypted local data, scoped to this site's origin and browser profile. Browser extensions, device access, or a compromised same-origin script can read them. This is not a secrets vault. Clearing site data deletes snippets; export backups before doing so.
- Invalid/newer saved data is never automatically deleted or overwritten. Valid legacy arrays migrate on the next edit. Existing text previously stripped by older CopyClick versions cannot be reconstructed.
- Cross-tab checking detects already-written changes; localStorage does not provide an atomic compare-and-swap transaction. Simultaneous edits in multiple tabs are not a supported collaboration workflow.
- HTTPS or localhost is required for the Clipboard API and native `crypto.randomUUID()`. Clipboard permission can still be refused. Failed copies keep the text and show manual-copy guidance.
- Google Fonts remains in use to preserve the exact typography and makes requests to Google. Optional Vercel Analytics / Speed Insights requires `VITE_ENABLE_ANALYTICS=true` at build time and appropriate Vercel services. It is off by default and in development. The app does not pass snippet contents to telemetry.
- `vercel.json` defines a CSP, framing protection, MIME-sniffing protection, a referrer policy, and restricted device permissions. Other hosts need equivalent response headers. Local production tests exercise these headers; an actual Vercel deployment and enabled telemetry have not been tested or published.
- The CSP permits inline styles because the existing Motion/textarea sizing uses them; it does not permit inline scripts or eval. Same-origin scripts and the configured font/optional telemetry endpoints remain trust boundaries.

See [the maintenance and security report](docs/refresh-audit-2026-09-06.md) for evidence, exceptions and the visual comparison.
