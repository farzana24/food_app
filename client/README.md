# RideN'Bite Client

React 18 + Vite + Tailwind 4 client for the RideN'Bite food delivery platform. The app now includes a production-grade Restaurant Role dashboard with authenticated routing, Zustand state, shadcn/ui components, and socket-driven realtime updates.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- Zustand for local state orchestration
- Axios (shared `client/src/api/client.ts` instance)
- Recharts for data viz
- Socket.IO client for realtime orders + alerts
- Framer Motion for subtle motion

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # type-check + production build
npm run preview   # preview production build
npm run test      # vitest unit tests
```

## Restaurant Dashboard Architecture

```
src/restaurant
├── RestaurantApp.tsx              # Nested router mounted at /restaurant/*
├── layout/
│   ├── RestaurantLayout.tsx      # Sidebar + topbar + skeleton loader
│   ├── Sidebar.tsx               # RideN'Bite navigation + logout
│   └── Topbar.tsx                # Search, alerts dropdown, profile menu
├── pages/
│   ├── OverviewPage.tsx          # Stats cards, charts, realtime alerts
│   ├── MenuPage.tsx              # CRUD + bulk actions for dishes
│   ├── OrdersPage.tsx            # Order board, status flow, details dialog
│   ├── EarningsPage.tsx          # Earnings summary + payout form
│   ├── ProfilePage.tsx           # Restaurant identity form
│   ├── AnalyticsPage.tsx         # Deep-dive charts (Recharts)
│   └── SettingsPage.tsx          # General + security controls
├── components/
│   └── MenuForm.tsx              # Reusable dish form with validation
├── hooks/
│   ├── useMenuBulkSelection.ts   # Bulk checkbox helper
│   └── useRestaurantSocket.ts    # Socket.IO bridge for alerts/orders
├── store/
│   └── restaurantStore.ts        # Zustand store + API wiring + fallbacks
├── services/
│   └── restaurantApi.ts          # Axios wrappers for /restaurant endpoints
├── data/
│   └── dummy.ts                  # RideN'Bite themed mock/fallback data
├── constants/
│   └── navigation.ts             # Sidebar route metadata
└── types/
    ├── index.ts                  # Shared domain types/enums
    └── schemas.ts                # Zod schemas & form value types
```

## Routing & Auth

- `App.tsx` mounts `/restaurant/*` inside `ProtectedRoute` limited to the `RESTAURANT` role.
- `RoleBasedRedirect.tsx` now funnels restaurant users directly to `/restaurant` after login.

## Styling System

- Tailwind classes power layout + responsive design (`src/index.css` already imports Tailwind 4).
- shadcn/ui primitives (buttons, cards, tables, dialogs, toasts) live under `src/admin/components/ui` and are reused by the restaurant dashboard for visual parity.
- Dark mode toggled by adding/removing the `dark` class on `document.documentElement`; persisted during the session.

## Realtime + State

- `useRestaurantStore` centralises API calls, optimistic updates, fallback data, and toast surfacing.
- `useRestaurantSocket` listens for `restaurant:new-order` + `restaurant:status` events and pushes alerts + refreshes orders.

## Forms & Validation

- Zod schemas (`types/schemas.ts`) back all forms (menu items, profile, payouts, settings) ensuring typed payloads before hitting the API.
- Menu + payout + profile pages show inline validation errors and success toasts.

## Optional Improvements

- Hook up real backend endpoints once available (replace dummy fallbacks in `restaurantStore`).
- Wire security settings to actual backend sessions and MFA provider.
- Add vitest coverage for hooks and store logic.
- Expand socket channels to stream rider GPS updates in near realtime.

## Getting Started

1. Install deps: `npm install`
2. Start API + Socket servers (see `/server`).
3. Run `npm run dev` and login as a user with `role: "RESTAURANT"`.

The RideN'Bite dashboard is mobile-first, dark-mode aware, and tuned for modern SaaS UX patterns.
