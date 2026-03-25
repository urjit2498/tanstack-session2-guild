# TanStack Query Guild — Session 2

An interactive presentation app covering advanced TanStack Query patterns.
Built with Vite + React + TypeScript, same stack as Session 1.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the mock API (port 5000)
```bash
npm run server
```

### 3. Start the dev server (port 5173)
```bash
npm run dev
```

Open http://localhost:5173

### Production (Netlify, etc.)

The UI calls a **json-server** API. Locally that is `http://localhost:5000`. In production the browser cannot reach your laptop, so you must host the same API somewhere public and point the build at it.

1. Deploy `db.json` + json-server (e.g. [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), or any small Node host). Your API should expose the same routes as locally (`/users`, `/posts`, etc.).
2. In **Netlify**: **Site configuration** → **Environment variables** → add:
   - **Key:** `VITE_API_URL`
   - **Value:** your API origin only, no trailing slash, e.g. `https://your-api.example.com`
3. Trigger a new deploy (Vite bakes this value in at **build** time).

Optional: create a `.env.local` for local overrides:

```bash
VITE_API_URL=http://localhost:5000
```

---

## 📚 Topics Covered

| # | Topic | Time | Route |
|---|-------|------|-------|
| 1 | Dependent Queries | ~10 min | `/dependent-queries` |
| 2 | Parallel Queries (useQueries) | ~15 min | `/parallel-queries` |
| 3 | Advanced Mutations | ~15 min | `/advanced-mutations` |
| 4 | Prefetching & Background Updates | ~10 min | `/prefetching` |
| 5 | Suspense Mode & Error Boundaries | ~10 min | `/suspense-mode` |

---

## 🎯 Presentation Tips

- Keep **React Query DevTools** open (floating button bottom-right) to show cache updates live
- On **Topic 1**: show the DevTools "Queries" tab — watch `users/1/posts` stay IDLE until user resolves
- On **Topic 3**: toggle "Simulate Error" to demonstrate rollback — very visual
- On **Topic 4**: hover over users slowly so audience sees the prefetch label appear before clicking
- On **Topic 5**: click "Re-mount" repeatedly to see the Suspense skeleton + data swap

## 📦 Tech Stack

- React 19 + Vite 6
- @tanstack/react-query v5
- @tanstack/react-query-devtools v5
- react-error-boundary
- React Router 7
- json-server (mock API)
- TypeScript + Sora + JetBrains Mono fonts
