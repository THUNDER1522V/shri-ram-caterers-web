# Shri Ram Caterers — Web Experience

A high-performance, luxury wedding catering web application built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lenis smooth scrolling, Three.js / WebGL shaders, and canvas ambient physics.

---

## Environment Variables

Copy `.env.example` to `.env.local` to configure local environment variables:

```bash
cp .env.example .env.local
```

| Variable | Description | Default | Required in Production |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical origin URL for metadata, sitemaps, OpenGraph, and structured JSON-LD data. | `https://shriramcaterers.com` | Yes |

*Note: All secret keys, database credentials, and internal tokens must never be prefixed with `NEXT_PUBLIC_` and must only reside in server-side runtime environments.*

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 20.0.0` (LTS 22 recommended, see `.nvmrc`)
- **npm**: `>= 10.0.0`

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site in development.

### Production Build & Verification

```bash
npm run build
npm start
```

---

## Security & Architecture Features

- **Strict Security Headers**: HSTS (with preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, and `Permissions-Policy`.
- **Content Security Policy (CSP)**: Strict origin control restricting resources to `'self'`, self-hosted fonts, and verified media/image endpoints (`images.unsplash.com`).
- **Production Hardening**: Production browser source maps disabled (`productionBrowserSourceMaps: false`), powered-by headers disabled (`poweredByHeader: false`), debug flags stripped from client runtime, and raw error stacks protected in client error boundaries.
- **Inquiry Channel Security**: Enquiries are routed exclusively via direct WhatsApp and telephone channels with URL-encoded parameters; no unsecured form endpoints or unauthenticated database exposures exist.
- **Automated CI & Dependabot**: Continuous integration running ESLint, TypeScript verification, Next.js production builds, and weekly dependency vulnerability tracking.
