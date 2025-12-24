# ScanBridge

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JuanRoccia/scanbridge-professional-qr-to-whatsapp-gateway)]

ScanBridge is a modern fullstack application built with React, Tailwind CSS, and Shadcn/UI, powered by Cloudflare Workers for the backend. It provides a production-ready starter template with routing, state management, theming, error handling, and API integration.

## Features

- **Modern UI**: Responsive design with Tailwind CSS, Shadcn/UI components, dark/light theme support
- **Fullstack**: React frontend with Vite + Cloudflare Workers backend using Hono
- **State Management**: TanStack Query, Zustand, Immer
- **Routing**: React Router with error boundaries
- **Developer Experience**: Hot reload, TypeScript, ESLint, auto-deployment ready
- **Performance**: Optimized builds, code splitting, Cloudflare assets handling
- **UI Components**: Complete Shadcn/UI library (accordion, dialog, sidebar, charts, etc.)
- **Animations & Effects**: Tailwind animations, Framer Motion, glassmorphism
- **Mobile-First**: Responsive layout with mobile hooks and swipe support

## Tech Stack

| Frontend | Backend | Tools | Styling | Utils |
|----------|---------|-------|---------|-------|
| React 18 | Cloudflare Workers | Vite 6 | Tailwind CSS 3 | TypeScript 5 |
| React Router 6 | Hono 4 | Bun | Shadcn/UI | TanStack Query |
| React Hook Form |  | Wrangler | Lucide Icons | Zod |
| Framer Motion |  | ESLint | Tailwind Animate | Sonner (Toasts) |

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd scanbridge-hhb5c_6q_3xbfhfaw9yy9
   bun install
   ```

2. **Development**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Build & Preview**:
   ```bash
   bun run build
   bun run preview
   ```

## Installation

This project uses **Bun** as the package manager for optimal performance.

```bash
# Install dependencies
bun install

# Generate Cloudflare types (if needed)
bun run cf-typegen
```

## Development

- **Frontend**: Edit files in `src/`
  - Pages: `src/pages/`
  - Components: `src/components/`
  - Hooks: `src/hooks/`
- **Backend API**: Add routes in `worker/userRoutes.ts`
  - Auto-reloads in dev mode
  - Test: `curl http://localhost:3000/api/test`
- **Custom Styling**: Extend `tailwind.config.js` and `src/index.css`
- **New Shadcn Component**:
  ```bash
  npx shadcn-ui@latest add <component>
  ```

**Scripts**:
- `bun run dev` - Start dev server
- `bun run lint` - Lint code
- `bun run build` - Production build
- `bun run preview` - Preview production build

## Usage Examples

### Frontend Development
Replace `src/pages/HomePage.tsx` with your pages. Update `src/main.tsx` for routing:

```tsx
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <DashboardPage /> },
]);
```

### Backend API Routes
In `worker/userRoutes.ts`:

```ts
app.post('/api/users', async (c) => {
  const data = await c.req.json();
  return c.json({ success: true, data });
});
```

### Theme Toggle
Uses `useTheme()` hook - automatically persists in localStorage.

### Error Reporting
Client errors auto-reported to `/api/client-errors`.

### Sidebar Layout
Wrap pages: `<AppLayout><YourPage /></AppLayout>`

## Deployment

Deploy to Cloudflare Workers with one command:

```bash
bun run deploy
```

This builds the app and deploys via Wrangler. Your assets are automatically served from Cloudflare.

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JuanRoccia/scanbridge-professional-qr-to-whatsapp-gateway)]

### Custom Domain
1. Deploy and note the worker URL
2. In Cloudflare Dashboard: Workers > Your Worker > Triggers > Add Custom Domain

### Environment Variables
Add to `wrangler.jsonc` under `vars` or use Cloudflare Dashboard.

### CI/CD
Compatible with GitHub Actions, Cloudflare Pages, etc.

## Project Structure

```
├── src/                 # React frontend
│   ├── components/      # UI components (Shadcn + custom)
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
├── worker/              # Cloudflare Workers backend
├── tailwind.config.js   # Tailwind + animations
└── wrangler.jsonc      # Deployment config
```

## Contributing

1. Fork the repo
2. Create feature branch: `bun install && bun run dev`
3. Commit changes: `git commit -m "feat: add X"`
4. Push & PR

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ on Cloudflare Workers. Questions? [Cloudflare Docs](https://developers.cloudflare.com/workers/)