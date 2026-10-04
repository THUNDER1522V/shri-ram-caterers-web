# General Hydration & Rendering Rules

- Never read `window`, `navigator`, `localStorage`, `matchMedia`, `Date.now`, or `Math.random` during the initial component render. These can only be read inside `useEffect` or in dynamically imported components with `ssr: false`.
- Count-up numbers must render their final value in the server HTML to prevent hydration mismatches.
- Every UI or logic change must pass a console check with NO hydration warnings before reporting the task as done. Always verify by checking browser logs after running `npm run dev` and clearing `.next` if necessary.
