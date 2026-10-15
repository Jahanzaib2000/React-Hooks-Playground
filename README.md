# React Hooks Playground

Interactive lessons and sandboxes for 18 React hooks, built with React, Vite, Wouter and vanilla CSS.

Install dependencies with `npm ci`, then run:

```sh
npm run dev
npm run validate
npm run preview
```

`validate` checks physical source-file line counts, runs the line-checker and calculation tests, lints and builds. Use `npm.cmd` on Windows if PowerShell blocks npm.ps1. Production preview requires a completed build.

Canonical URLs use `/hooks/<kebab-case-hook>`, such as `/hooks/use-state` and `/hooks/use-insertion-effect`. `/` redirects to useState. Localhost Vite servers support nested URLs; a future deployment host must serve `dist/index.html` for client routes.

See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for architecture, ownership, contracts, extension rules and known limitations, and [the refactor plan](codebase-refactor-plan.md) for the completed implementation plan.
