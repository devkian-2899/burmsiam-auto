# BurmSiamAuto

One-page site for BurmSiamAuto. Vercel publishes every push to `main` on GitHub.

## Change the film, photos, and links

Edit `content/site.js`, then push to `main`.

- `youtube` is the film in the header.
- `heroBackground` is the 3840 × 2160 picture behind the slogan.
- `slides` are up to four 3840 × 2160 latest stories. `href` is the page that opens in a new tab.
- `programs` are twelve 1080 × 1080 icons. They are not links in this version.
- The contact addresses are in the same file.

For each photo, upload a WebP or AVIF file to Google Drive, share it as **Anyone with the link**, and paste that link. Replacing the picture inside the same Drive file updates the site without another code change.

Replace the header mark by changing `public/logo.svg`.

## Run it on your computer

```bash
npm install
npm run dev
```

Open the address the terminal prints.

## Domain

The live name is the `www` domain added in Vercel. Cloudflare DNS points at Vercel with the proxy turned off (grey cloud, DNS only). The name without `www` redirects to `www`.
