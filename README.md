# Dogplay Agent SEO Platform

A high-performance SEO-driven affiliate marketing platform for the Indian market, built with Next.js and automated content generation.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **i18n**: next-intl (English, Hindi)
- **Automation**: Python + GitHub Actions
- **Deployment**: Cloudflare Pages
- **Content APIs**: Brave Search, Chutes.ai LLM

## Project Structure

```
dpy1/
├── src/
│   ├── app/[locale]/          # Localized routes
│   │   ├── page.tsx           # Homepage with calculator
│   │   ├── blog/              # Blog pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   ├── affiliate-disclosure/
│   │   └── responsible-gambling/
│   ├── components/            # Reusable components
│   ├── i18n/                  # Internationalization config
│   ├── messages/              # Translation files (en.json, hi.json)
│   └── lib/                   # Utilities
├── scripts/
│   ├── daily_content_generator.py
│   └── requirements.txt
├── public/                    # Static assets
├── .github/workflows/         # GitHub Actions
└── PRD.md                     # Product requirements
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dpy1
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Required for production:

| Variable | Description | Source |
|----------|-------------|--------|
| `BRAVE_SEARCH_API_KEY` | News search API | [Brave Search](https://api.search.brave.com/) |
| `CHUTES_LLM_API_KEY` | Content generation | [Chutes.ai](https://chutes.ai/) |
| `CHUTES_IMAGE_API_KEY` | Image generation | [Chutes.ai](https://chutes.ai/) |
| `GITHUB_TOKEN` | Git operations | GitHub Settings |
| `CLOUDFLARE_API_TOKEN` | Deployment | Cloudflare Dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account | Cloudflare Dashboard |

## Automation

The daily content generator runs via GitHub Actions at 9:00 AM IST daily.

Manual trigger:
```bash
python scripts/daily_content_generator.py
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repo in Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy on push to `main` branch

### Via GitHub Actions

The `.github/workflows/deploy.yml` handles automatic deployment.

## SEO Features

- Multi-language sitemap with hreflang
- Structured data (Schema.org)
- Canonical URLs
- robots.txt
- Meta tags optimized for Indian market
- Core Web Vitals optimization

## Content Quality Gates

Automated content must pass:
- Minimum word count (300 words)
- Source attribution required
- Duplicate detection
- Thin content detection (auto noindex)

## Compliance

- Affiliate Disclosure on all pages
- `rel="sponsored nofollow"` on affiliate links
- Responsible Gambling page (18+)
- Privacy Policy
- Terms of Service

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## License

Proprietary - All rights reserved

## Support

For affiliate inquiries: support@dogplay.io
