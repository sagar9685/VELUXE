# VELUXE — The Curated Luxury Marketplace

A React frontend prototype for a premium luxury resale marketplace. Frontend only: all data is mock data held in memory (favourites are also saved to `localStorage`). No backend is required.

## Quick start

Requires Node.js 18 or later.

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # production build into /dist
npm run preview    # serve the production build locally
```

## Deploy to Vercel

1. Push the folder to a Git repository, or run `npx vercel` from the project root.
2. Vercel detects Vite automatically. `vercel.json` already sets the build command, the output folder and a rewrite so that deep links such as `/product/vx-009` work on refresh.

## Changing the brand

Everything brand-related lives in `src/config/site.js`:

- `name` and `tagline` — the wordmark, footer and page titles
- `contactEmail`
- `announcements` — rotating announcement bar messages
- `demoNotice` — the label shown wherever sample data appears

Brand colours are defined once in `tailwind.config.js` (`forest`, `charcoal`, `gold`, `ivory`, `muted`). Headings use Playfair Display and UI text uses Inter, both loaded in `index.html`.

## Folder structure

```
veluxe/
├── index.html
├── vercel.json                 Vercel build and SPA rewrite settings
├── tailwind.config.js          Brand palette, fonts, shadows, animations
├── src/
│   ├── main.jsx                Entry point: router + marketplace provider
│   ├── App.jsx                 Route table
│   ├── index.css               Tailwind layers and shared component classes
│   ├── config/
│   │   └── site.js             Brand name, tagline, announcements, notices
│   ├── context/
│   │   └── MarketplaceContext.jsx   Global state: listings, favourites, compare,
│   │                                offers, inquiries, notifications, toasts
│   ├── data/                   Mock data (clearly labelled as sample data)
│   │   ├── products.js         20 sample listings
│   │   ├── sellers.js          Seller profiles (ratings are demo values)
│   │   ├── categories.js       Category cards
│   │   ├── brands.js           Featured brands
│   │   ├── collections.js      Curated collections (tag-based)
│   │   ├── drops.js            Exclusive drops
│   │   └── account.js          Buyer profile, notifications, offers, revenue
│   ├── lib/
│   │   ├── listings.js         Filtering, sorting, URL-to-filter parsing
│   │   ├── format.js           Currency, dates, countdowns
│   │   ├── images.js           Image URL helper and hero image
│   │   ├── categoryIcons.js    Category → icon mapping
│   │   └── useNow.js           Ticking clock for live countdowns
│   ├── components/
│   │   ├── Layout.jsx          Page frame (announcement, nav, footer, overlays)
│   │   ├── Navbar.jsx          Responsive navigation and search
│   │   ├── NotificationCenter.jsx
│   │   ├── ProductCard.jsx     Listing card with wishlist and compare
│   │   ├── OfferModal.jsx      Make an Offer
│   │   ├── ContactModal.jsx    Contact Seller
│   │   ├── CompareBar.jsx      Comparison tray and side-by-side table
│   │   ├── AIConcierge.jsx     Scripted concierge (mock, no model call)
│   │   ├── ImageWithFallback.jsx   Graceful image fallback
│   │   └── …                   Badges, Modal, Toaster, Logo, Footer, etc.
│   └── pages/
│       ├── Home.jsx            Cinematic homepage
│       ├── Explore.jsx         Search, filters, sort, grid, empty states
│       ├── ProductDetail.jsx   Gallery, authenticity, seller, specs, similar
│       ├── Sell.jsx            Eight-step listing wizard with preview
│       ├── SellerStorefront.jsx
│       ├── Wishlist.jsx
│       ├── Account.jsx         Buyer dashboard (five sections)
│       ├── SellerDashboard.jsx KPIs, revenue chart, listing management
│       ├── Collections.jsx
│       └── NotFound.jsx
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/explore` | Marketplace (accepts `?q=`, `?category=`, `?brand=`, `?collection=`, `?auction=1`, `?verified=1`, `?sort=`) |
| `/collections` | Exclusive collections |
| `/product/:productId` | Product detail |
| `/sell` | Listing wizard |
| `/seller/:sellerId` | Seller storefront |
| `/wishlist` | Saved products |
| `/account` | Buyer dashboard |
| `/dashboard/seller` | Seller dashboard |

## Features demonstrated

- Favourite and unfavourite products (persisted to `localStorage`)
- Search by product, brand and location; category, brand, condition, price and verified filters; sorting; empty states
- Make an Offer modal with validation and quick-select percentages
- Seller contact interface with preferred next step
- Product comparison (up to three listings) with a side-by-side table
- AI listing assistant (mock description drafting) and a mock concierge chat
- Authenticity status on every listing, with plain-language explanations
- Verified seller profiles and storefronts
- Timed auction preview with live countdowns (bidding is simulated)
- Notification centre with read state and dismissal
- Responsive navigation with a full-screen mobile menu

## Important notes

- **Sample data only.** Listings, sellers, ratings, review counts, revenue, offers and inquiries are invented for demonstration. Authenticity statuses are illustrative and no item has been authenticated by a real examiner. The UI says so on every page that shows sample records.
- **Nothing is sent.** Offers, messages, subscriptions and published listings stay in the browser session. No payment, messaging or account system is connected.
- **Images** are referenced from Unsplash by photo ID. Before going live, replace them with licensed brand photography and confirm usage rights. Any image that fails to load shows a branded placeholder.
- **Concierge** responses are scripted by keyword. No AI model is called.

## Next steps for a production build

Replace `src/data/*` with API calls behind a data layer, add authentication, move offers and messaging to a server, connect a payment and escrow provider, and integrate a real authenticity review workflow.
