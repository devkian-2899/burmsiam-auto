# Automobile media

A blank Next.js site. The only page says **Hello World**. Layout and the film come later, when the storyboard is ready.

The site is JavaScript. [Vercel](https://vercel.com) builds and runs Next.js. It does not run a Java server, so a Java app cannot be the thing Vercel deploys. Later pages stay in this same JavaScript project. Pushing to Git is what publishes them.

## Run it on your computer

```bash
npm install
npm run dev
```

Open the address the terminal prints (usually `http://localhost:3000`).

## What is already done

The Hello World project is in Git. Two things still need your own accounts, because they take your name and your payment:

- Buying `www.mybusinessname.com`
- The one-time import into your Vercel account

After that import, you do not deploy by hand. A push to `main` is the deploy.

## 1. Put the project on GitHub

Vercel pulls from GitHub, GitLab, or Bitbucket. It does not pull from this chat.

1. In Cursor, create the repository with the **Create repo** control if you do not have one yet.
2. Sign in to [GitHub](https://github.com) and confirm the repository is there.
3. Leave the default branch named `main`. That is the branch Vercel will publish.

## 2. Buy the domain

Buy the name at **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)**.

That is the best fit for this setup. A `.com` is sold at the registry wholesale price (about **$10.46 per year** as of 6 Nov 2026), and the renewal stays the same price. WHOIS privacy is included. DNS lives in the same account you will use to point the name at Vercel.

Use [Porkbun](https://porkbun.com) instead if you want a person on phone or chat. Their `.com` price is a little higher and also stays flat. Skip GoDaddy. The first year looks cheap there, and the renewal does not.

Do not buy the domain from Vercel. You want the name registered in your own account. Vercel only hosts the site.

You cannot remove Vercel’s `*.vercel.app` address. Every project keeps one. Visitors never need it: `www.mybusinessname.com` is the address you share, and the bare name redirects to `www`.

### Buy it

1. Create a free Cloudflare account.
2. Open **Domain Registration** → **Register Domains**.
3. Search the real name, for example `mybusinessname.com`. If it is taken, pick another `.com`. Do not buy a look-alike spelling.
4. Register it for one year and turn on auto-renew.
5. Leave WHOIS privacy on. Cloudflare turns it on for you.

A `.co.th` name is a different process. Thai country domains are sold through THNIC-accredited registrars and often need a local presence. For `www.mybusinessname.com`, stay on `.com`.

## 3. Deploy on Vercel, once

1. Sign up at [vercel.com](https://vercel.com) with the same GitHub account that holds the repository.
2. **Add New…** → **Project** → **Import** that repository.
3. Framework preset: **Next.js**. Root directory: the repository root. No environment variables.
4. Click **Deploy** and wait until the Hello World page is up.

That click is the only deploy you do yourself. In **Settings → Git**, production branch is `main`. Every later push to `main` builds and goes live. You do not open Vercel again to publish.

Work on `main`, or merge into `main` when a change is ready. A push to any other branch does not replace the live site.

## 4. Use only www.mybusinessname.com

1. In the Vercel project, open **Settings → Domains**.
2. Add `www.mybusinessname.com`.
3. Add `mybusinessname.com` as well.
4. Set **www.mybusinessname.com** as the primary domain.
5. Set `mybusinessname.com` to **redirect** to `www.mybusinessname.com`. Vercel uses a 308 redirect. People who type the name without `www` still land on `www`.

Vercel then shows the DNS records for this project. Copy those values. They can differ per project. The usual records are:

| Type | Name | Value | What it does |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | The name without `www` |
| CNAME | `www` | the hostname Vercel shows, often `cname.vercel-dns-0.com` | `www.mybusinessname.com` |

Add them in the **Cloudflare** dashboard for the domain, under **DNS → Records**.

Set each record to **DNS only** (grey cloud). Leave the orange proxy cloud off. The orange cloud puts Cloudflare in front of Vercel and breaks the certificate Vercel issues for your domain.

Back in Vercel, wait until both domains say valid and the certificate is issued. That is often a few minutes, and it can take a few hours. Then open `https://www.mybusinessname.com` and you should see Hello World.

## What comes after the storyboard

No file storage is required for the media plan:

- One film is a YouTube embed. YouTube hosts the video.
- Photos can be public Google Drive images. Drive hosts the files. The page only needs each file shared as **Anyone with the link**.

Those pieces are not in this Hello World. Send the storyboard next and the pages get built in this same project. Push to `main` when they are ready. Vercel publishes that push.
