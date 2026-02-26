# Troubleshooting

## "Cannot find module './vendor-chunks/next-intl.js'"

**Symptom:** Server or build fails with:
```text
Error: Cannot find module './vendor-chunks/next-intl.js'
Require stack: ... .next\server\webpack-runtime.js ...
```

**Cause:** Stale or corrupted Next.js build cache (`.next`). The runtime expects a vendor chunk that was from an old build or never generated correctly.

**Fix (pick one):**

1. **Dev server:** Stop it, then run `npm run dev:clean` (cleans `.next` and starts dev).

2. **Build:** Run `npm run build:clean` (cleans and builds).

3. **Manual:** Stop the dev server, delete the `.next` folder, then run `npm run dev` or `npm run build` again.

No code or dependency changes are required. If the error persists after a clean build, run `npm ci` to reinstall dependencies from lockfile.
