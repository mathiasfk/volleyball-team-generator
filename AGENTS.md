# Project guidelines

- Use the Node.js version in `.nvmrc` and the pnpm version in `package.json`.
- Install dependencies with `pnpm install --frozen-lockfile`.
- Before finishing changes, run the relevant tests. For changes affecting the build, dependencies, or CI, also run `pnpm test --run`, `pnpm lint`, and `pnpm build` when feasible.
- The CI checks the primary Node version and a newer compatibility version. Keep both in mind when updating Node, dependencies, or test infrastructure.
- Browser APIs in tests must come from an explicit browser-like environment; do not assume that a Node global behaves like its browser counterpart.
- `pnpm build` regenerates `public/sitemap.xml`. Preserve unrelated local changes when running it.
