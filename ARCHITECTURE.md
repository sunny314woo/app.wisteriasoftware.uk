# app.wisteriasoftware.uk Architecture

This folder is a separate site root for the new `app.wisteriasoftware.uk` portal. It is intentionally isolated from the legacy `wisteriasoftware-site-main` site.

## Goals

- Ship a new product portal for the Wisteria Inbox Suite.
- Keep the old marketing site untouched.
- Support Paddle hosted checkout review with dedicated pricing and legal pages.
- Launch English first while preserving a clean bilingual path.

## Page Tree

```text
app.wisteriasoftware.uk/
├── index.html
├── products/
│   └── index.html
├── downloads/
│   └── index.html
├── pricing/
│   └── index.html
├── support/
│   └── index.html
├── privacy/
│   └── index.html
├── terms/
│   └── index.html
├── refund/
│   └── index.html
├── checkout/
│   ├── success/
│   │   └── index.html
│   └── cancel/
│       └── index.html
└── assets/
    ├── css/
    │   └── site.css
    ├── js/
    │   ├── i18n.js
    │   └── site.js
    └── data/
        ├── site.config.js
        ├── site.en.js
        └── site.zh.js
```

## Route Table

| Route | Purpose | Status in skeleton |
| --- | --- | --- |
| `/` | Suite homepage | Implemented |
| `/products/` | Product overview | Implemented |
| `/downloads/` | Download hub | Implemented |
| `/pricing/` | Commercial entry point, annual plan `$19/year` | Implemented |
| `/support/` | Contact and support routing | Implemented |
| `/privacy/` | Privacy policy | Implemented |
| `/terms/` | Terms of service | Implemented |
| `/refund/` | Refund policy | Implemented |
| `/checkout/success/` | Paddle return page | Implemented |
| `/checkout/cancel/` | Paddle cancellation page | Implemented |

## Component Tree

Current skeleton uses shared HTML containers plus JS-rendered site chrome.

```text
Layout
├── Header
│   ├── BrandLockup
│   ├── PrimaryNav
│   └── LanguageSwitch
├── Main
│   ├── Hero
│   ├── ProductCardGrid
│   ├── WorkflowGrid
│   ├── Carousel
│   ├── PricingCard
│   ├── LegalCardGrid
│   └── CTASection
└── Footer
    ├── FooterBrand
    ├── FooterNav
    └── FooterMeta
```

## Config Structure

### `assets/data/site.config.js`

Site-wide operational config:

- `brand`
  - company and support metadata
- `pricing`
  - annual USD price
- `links`
  - internal routes
  - external product downloads
  - Paddle hosted checkout placeholder

This is where you replace:

- `links.suiteCheckoutUrl`
- `links.inboxExtensionUrl`
- `links.inboxLocalMacUrl`

### `assets/data/site.en.js`

English content dictionary for:

- navigation
- footer
- homepage sections
- products
- downloads
- pricing
- support
- privacy
- terms
- refund
- checkout pages

### `assets/data/site.zh.js`

Reserved Chinese dictionary. The skeleton currently wires the locale switch and basic shared strings, while English remains the launch-default content source.

## I18n Approach

Current implementation:

- launch language is English
- locale switch persists with `localStorage`
- `?lang=en` and `?lang=zh` are supported
- shared text and page metadata are dictionary-driven

Recommended next step:

- move to route-based locales once copy is ready:
  - `/en/...`
  - `/zh/...`
- keep `site.config.js` shared
- split long-form legal copy per locale when translation is approved

## Paddle Integration Plan

For hosted checkout:

- pricing CTA should point to `site.config.js -> links.suiteCheckoutUrl`
- success URL should be `/checkout/success/`
- cancel URL should be `/checkout/cancel/`
- privacy, terms, refund, and support pages remain in the footer and pricing flow

## Content Architecture

Recommended information hierarchy:

1. Homepage sells the suite and explains the workflow.
2. Products page separates the three products clearly.
3. Downloads page becomes the install source of truth.
4. Pricing page becomes the commercial source of truth.
5. Legal pages remain product-suite level, not single-product level.

## Migration Guidance

If this static skeleton grows further, the next sensible step is to migrate into Astro while preserving the same route model and data split:

- `src/content/i18n/en.ts`
- `src/content/i18n/zh.ts`
- `src/config/site.ts`
- `src/components/*`
- `src/pages/*`

That migration would keep the same IA while improving templating, SEO, and maintainability.
