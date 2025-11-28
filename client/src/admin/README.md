# Admin Dashboard

Production-ready admin dashboard for RideN'Bite food delivery platform.

## Features

- **Dashboard Home**: KPI cards, revenue charts, order trends, and recent orders
- **Restaurants Management**: Approve/reject restaurants, view details, manage menus
- **Orders Management**: Filter, search, view order details, reassign riders, cancel orders
- **Users Management**: Manage customers, restaurants, riders, and admins by role
- **Riders & Live Tracking**: Monitor active riders and their locations (map integration ready)
- **Analytics & Reports**: Revenue trends, delivery performance, top dishes
- **Settings**: Platform configuration and audit logs

## Tech Stack

- **React 19** - Latest React with functional components and hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Radix UI-based component library
- **Recharts** - Data visualization and charts
- **React Router v7** - Client-side routing
- **Socket.IO Client** - Real-time updates (ready for backend integration)
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing

## Directory Structure

```
src/admin/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Card, Table, Dialog, etc.)
│   ├── layout/          # Sidebar, Topbar, AdminLayout
│   └── KPICard.tsx      # Reusable KPI card component
├── pages/               # All admin pages
│   ├── DashboardHome.tsx
│   ├── RestaurantsManagement.tsx
│   ├── OrdersManagement.tsx
│   ├── UsersManagement.tsx
│   ├── RidersTracking.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
├── services/            # API and mock data services
│   └── mockData.ts      # Mock API with realistic data
├── types/               # TypeScript type definitions
├── utils/               # Helper functions (formatting, debounce, etc.)
├── __tests__/           # Unit tests
└── AdminApp.tsx         # Main admin app with routing
```

## Getting Started

### Installation

Dependencies are already installed. If needed, run:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Navigate to `/admin` after logging in with an ADMIN role account.

### Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test:watch
```

Generate coverage report:

```bash
npm test:coverage
```

### Building

Build for production:

```bash
npm run build
```

## Integration with Backend

### Replace Mock API

The admin dashboard currently uses mock data from `src/admin/services/mockData.ts`. To integrate with your backend:

1. Create `src/admin/services/adminApi.ts` with real API calls using axios
2. Update all pages to import from `adminApi.ts` instead of `mockData.ts`
3. Configure API base URL in environment variables

Example:

```typescript
// src/admin/services/adminApi.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const adminApi = {
  async getKPIs() {
    const { data } = await axios.get(`${API_BASE}/admin/kpis`);
    return data;
  },
  // ... other endpoints
};
```

### Real-time Updates with Socket.IO

Enable real-time order updates:

1. Connect to Socket.IO server in `src/admin/services/socketService.ts`
2. Subscribe to events in pages (e.g., 'newOrder', 'orderUpdated')
3. Update component state when events are received

Example:

```typescript
// In DashboardHome.tsx
useEffect(() => {
  const socket = io(SOCKET_URL);
  
  socket.on('newOrder', (order) => {
    setOrders((prev) => [order, ...prev]);
    toast({ title: 'New Order', description: `Order #${order.id}` });
  });

  return () => socket.disconnect();
}, []);
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## Accessibility Features

- Full keyboard navigation support
- ARIA labels and roles
- Semantic HTML
- Color contrast compliance (WCAG AA)
- Screen reader friendly

### Keyboard Shortcuts

- `Tab` / `Shift+Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate buttons and links
- `Esc` - Close modals and dialogs
- `Arrow keys` - Navigate within tables and lists

## Dark Mode

Toggle dark mode using the moon/sun icon in the topbar. Dark mode preference is stored in localStorage and persists across sessions.

## Role-Based Access

The admin dashboard is protected by role-based routing:

- Only users with `role: 'ADMIN'` can access `/admin/*` routes
- Non-admin users are redirected to the homepage
- Authentication is handled by `ProtectedRoute` component

## Deployment Checklist

- [ ] Replace mock API with real backend endpoints
- [ ] Configure environment variables for production
- [ ] Set up Socket.IO connection to production server
- [ ] Enable real-time updates for orders and riders
- [ ] Integrate Leaflet map for riders tracking
- [ ] Configure analytics tracking (optional)
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Enable HTTPS and secure cookies
- [ ] Run security audit: `npm audit`
- [ ] Build and test production bundle: `npm run build && npm run preview`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading for charts (Recharts)
- Debounced search inputs
- Virtual scrolling for large tables (ready to implement)
- Optimized re-renders with React.memo (where needed)

## Contributing

When adding new features:

1. Create new components in appropriate directories
2. Add TypeScript types in `types/index.ts`
3. Write unit tests for new components
4. Update this README with new features
5. Follow existing code patterns and conventions

## License

Proprietary - RideN'Bite Platform
