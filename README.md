# Free QR Code Creator

Client-side QR codes (via [qr-code-styling](https://github.com/kozakdenys/qr-code-styling), MIT), barcodes ([JsBarcode](https://github.com/lindell/JsBarcode), MIT), and scanning ([qr-scanner](https://github.com/nimiq/qr-scanner), MIT). By **Gentil M.** — not based on Mini QR.

**Live:** https://free-qr-code-creator.gentillenoir075.workers.dev

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npm run deploy
```

## Adsterra (`public/ads.json`)

Structured JSON: `popunder`, `socialBar` (HTML script tags), `nativeBelowResult`, `smartlinkUrl`, and `banners` (iframe-isolated `atOptions` units).

| Banner key | Size |
|------------|------|
| `headerBanner728x90` | 728×90 |
| `betweenContent728x90` | 728×90 |
| `sidebar160x600` | 160×600 |
| `sidebar160x300` | 160×300 |
| `sidebar300x250` | 300×250 |
| `sidebar468x60` | 468×60 |
| `mobileSticky320x50` | 320×50 |

Smartlink renders as labeled **Sponsored** (footer + below QR/barcode). Empty banner keys fall back to dashed placeholders.

## License

MIT — see `LICENSE` and `NOTICE` for third-party credits.
