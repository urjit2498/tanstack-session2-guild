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
