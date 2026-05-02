## Make PrepTrack installable as a shortcut

Goal: tap one icon on your phone home screen or laptop dock and land straight on today's challenges, streak, and score bar.

### What gets added

1. **App icons** (already generated and ready):
   - `public/icon-192.png` (192×192)
   - `public/icon-512.png` (512×512)
   - `public/apple-touch-icon.png` (180×180 for iOS)
   Indigo "Pt" mark on a dark-indigo rounded square — matches the app theme.

2. **`public/manifest.json`** — declares PrepTrack as an installable app:
   - `name`, `short_name: "PrepTrack"`
   - `start_url: "/"`, `display: "standalone"` → opens without browser chrome
   - `theme_color: #1a1530`, `background_color: #0b0a14`
   - Both icons referenced as `any maskable`

3. **`index.html`** — add inside `<head>`:
   - `<link rel="manifest" href="/manifest.json">`
   - `<meta name="theme-color" content="#1a1530">`
   - `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
   - `<meta name="apple-mobile-web-app-capable" content="yes">`
   - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
   - `<meta name="apple-mobile-web-app-title" content="PrepTrack">`

4. **`src/components/InstallPrompt.tsx`** — small dismissible bottom-left card that:
   - Listens for `beforeinstallprompt` (Chrome/Edge desktop, Android Chrome) → shows an **"Install now"** button that triggers the native install dialog
   - Detects iOS Safari → shows instructions: "Tap Share → Add to Home Screen"
   - Auto-hides if app is already installed (`display-mode: standalone`)
   - Permanently dismissable (stored in `localStorage` under `preptrack_install_dismissed`)

5. **`src/pages/Index.tsx`** — mount `<InstallPrompt />` at the bottom of the dashboard (alongside the Hanuman Coach floater).

### What is intentionally NOT added

- **No service worker, no `vite-plugin-pwa`, no offline cache.** Per Lovable's PWA guidance, service workers cause stale-content bugs in the editor preview and aren't needed just for installability. PrepTrack needs fresh Supabase data on every open anyway.

### How you actually install it

The install only works on the **published URL** (`https://tcsdigital.lovable.app`), not the editor preview iframe.

- **Android (Chrome)**: open the published URL → tap the "Install now" banner → icon appears on home screen.
- **iPhone (Safari)**: open the published URL → tap Share → "Add to Home Screen" → icon appears on home screen.
- **Laptop (Chrome / Edge / Brave)**: open the published URL → click the install icon in the address bar (or use the in-app banner) → app launches as standalone window, pinnable to taskbar/dock.

After install, tapping the icon opens straight to `/` — Brahmacharya streak, Morning + Night ritual, today's score, all visible immediately. No browser bar, no tabs.

You'll need to **click "Update" in the Publish dialog** after I ship this so the new manifest goes live on `tcsdigital.lovable.app`.

Approve and I'll write the 4 files and wire it in.
