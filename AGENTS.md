# Agents.md — World Cup 2026 React

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` (typecheck before build) |
| `npm run lint` | `oxlint` (not eslint) |
| `npm run preview` | Vite preview (serve built output) |

No test, formatter, CI, or pre-commit hooks are configured.

## Conventions

- **Package manager:** npm (lockfile v3). Do not use pnpm/yarn.
- **Path alias:** `@/` → `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- **Tailwind v4:** configured via `@tailwindcss/vite` plugin — no `tailwind.config.js`, no `@tailwind` directives needed
- **Linter:** oxlint (config: `.oxlintrc.json`). Rules: `react/rules-of-hooks` (error), `react/only-export-components` (warn).
- **TypeScript:** project references (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`). `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- **Typecheck:** `npm run build` already runs `tsc -b` before `vite build`.
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`

## Architecture

- **Single-package** (no monorepo tools, no `apps/` or `packages/` dirs)
- **Data source:** https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json — fetched via `src/api/api.ts`
- **`src/` layout:** `api/`, `App.tsx`, `main.tsx`, `index.css`, `assets/` (empty)
- **CSS:** `src/index.css` is empty by default (Tailwind v4 adds base styles via Vite plugin)
