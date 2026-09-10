# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
## Build Checklist

### Phase 0 — Setup
- [ ] `npm create vite@latest book-inventory -- --template react`
- [ ] `cd book-inventory && npm install`
- [ ] Install Tailwind: `npm install tailwindcss @tailwindcss/vite`
- [ ] Add Tailwind directives to `src/index.css`, configure `vite.config.js` plugin
- [ ] `npm install @supabase/supabase-js`
- [ ] Create Supabase project → copy URL + anon key into `.env.local`

### Phase 1 — Database
- [ ] Create the `books` table (id, name, author, category, qty, language, isbn, cover_url, status, created_at)
- [ ] Enable RLS on the table (toggle in Supabase table settings)
- [ ] Import spreadsheet via CSV, add `status = 'owned'` to all existing rows

### Phase 1.5 — Auth
- [ ] Supabase dashboard → Authentication → Users → add your account + your wife's account (auto-confirm on)
- [ ] Run the RLS SQL policies in the SQL Editor
- [ ] Build `Login.jsx`
- [ ] Wrap `App.jsx` with the session check
- [ ] Test: confirm logged-out users see the login screen, and Supabase queries fail without a session

### Phase 2 — Read/list working end to end
- [ ] Build `supabaseClient.js`
- [ ] Build `BookCard.jsx`
- [ ] Build `BookList.jsx` (fetch `status = 'owned'`, render cards)
- [ ] Confirm data renders in `App.jsx`

### Phase 3 — Search
- [ ] Build `SearchBar.jsx`
- [ ] Wire `.ilike` filter on name/author

### Phase 4 — Manual add
- [ ] Build `AddBookForm.jsx`
- [ ] Wire `supabase.from('books').insert(...)`
- [ ] Refresh list on success

### Phase 5 — Barcode scanning
- [ ] `npm install @zxing/browser`
- [ ] Build `BarcodeScanner.jsx`
- [ ] Test camera permission on your phone (needs HTTPS — test on a Vercel preview URL, not local http)

### Phase 6 — Autofill from ISBN
- [ ] Build `bookLookup.js` (Google Books → fallback Open Library)
- [ ] Wire scanner → lookup → prefill `AddBookForm`

### Phase 7 — Cover photos
- [ ] Save `cover_url` on insert
- [ ] Render in `BookCard`, add placeholder for missing covers

### Phase 8 — Wishlist
- [ ] Add owned/wishlist toggle in `AddBookForm`
- [ ] Add tabs in `App.jsx` filtering by `status`
- [ ] "Move to shelf" button updating `status`

### Phase 9 — Polish & deploy
- [ ] Tailwind mobile-first pass
- [ ] Push to GitHub → connect to Vercel
- [ ] Add env vars in Vercel dashboard (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Full real-phone test: login → scan → autofill → save → search → wishlist toggle → logout
