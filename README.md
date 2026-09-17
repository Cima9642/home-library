# Home Library

A simple, self-hosted book inventory app for tracking what your household owns: title, author, format, language, quantity, and whether it's on the wishlist. Built to be forked, customized, and run by anyone who wants their own private catalog without setting up a full backend.

Search your collection before buying a duplicate, log new books in seconds, and keep the whole thing locked behind a shared password so it's safe to host publicly.

## Features

- **Add, edit, and delete books** with title, author, format (Hardback / Paperback / Board), quantity, language (English / Spanish / Bilingual), and wishlist status
- **Search** by title or author to check if you already own something
- **Password-gated access** — safe to deploy publicly while staying private to your household
- Built on **React + TypeScript + Vite**, **Supabase**, and **Tailwind CSS** — no custom backend server required

## Tech stack

| Layer | Tool |
|---|---|
| Frontend framework | React + TypeScript (Vite) |
| Styling | Tailwind CSS |
| Database & API | Supabase (Postgres) |
| Hosting | Vercel |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/home-library.git
cd home-library
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run:

    ```sql
    create table books (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      author text not null,
      material text not null check (material in ('Board', 'Hardback', 'Paperback')),
      quantity integer not null default 1,
      language text not null check (language in ('English', 'Spanish', 'Bilingual')),
      wishlisted boolean not null default false,
      created_at timestamptz not null default now()
    );

    alter table books enable row level security;

    create policy "Allow all access to books"
    on books
    for all
    using (true)
    with check (true);
    ```

3. Grab your **Project URL** and **anon/publishable key** from Settings → API.

> **Note on security:** this schema uses a permissive RLS policy, since access control is handled by the app's password gate rather than per-user database rules. This is appropriate for a small private tool, not for sensitive data. If you need real per-user access control, look into Supabase Auth instead.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_PASSWORD=choose-a-shared-password
```

All three **must** be prefixed with `VITE_` — Vite only exposes environment variables to the frontend if they start with that prefix. Never commit this file (it's already covered by `.gitignore`).

### 4. Run it locally

```bash
npm run dev
```

Open the printed local URL, enter the password you set, and you should see the app.

## Importing existing data

If you already have a spreadsheet of books:

1. Make sure your CSV's column headers exactly match the table's columns: `title, author, material, quantity, language, wishlisted`.
2. **Leave out `id` and `created_at`** — the database generates both automatically.
3. Make sure `language` only contains `English`, `Spanish`, or `Bilingual`, and `material` only contains `Board`, `Hardback`, or `Paperback` (exact spelling and casing).
4. In Supabase: Table Editor → `books` → Insert → **Import data from CSV**.

## Deploying to Vercel

1. Push your repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Vercel auto-detects the Vite build settings.
3. Under Environment Variables, add the same three from your `.env.local` — scoped to **Production**.
4. Deploy.

Environment variables are baked into the build at build time, not read live — so if you add or change one later, you'll need to **trigger a new deployment** for it to take effect.

## Project structure

```
src/
├── main.tsx                  # React entry point
├── App.tsx                    # top-level component
├── types.ts                    # shared TypeScript types (Book, Language, Material, etc.)
├── lib/
│   ├── supabaseClient.ts        # single shared Supabase client instance
│   └── books.ts                  # all database queries for the books table
└── components/
    ├── PasswordGate.tsx           # simple shared-password lock screen
    ├── BookForm.tsx                 # add/edit form
    └── BookList.tsx                  # search results / inventory list
```

Database logic lives entirely in `lib/`; components only render UI and call into `lib/` functions — they never talk to Supabase directly.

## A note on the password gate

Access control here is intentionally lightweight: a single shared password, checked client-side, remembered for the browser session via `sessionStorage`. It's meant to keep casual visitors and search engines out of a small private tool — not to withstand a determined attacker (the password does end up in the built JavaScript bundle). Don't reuse a sensitive password for it, and don't use this pattern for anything storing sensitive data.

## Roadmap / ideas for forks

- [ ] Tabbed Inventory / Add Book views with bulk checkbox actions (select multiple books to delete or wishlist at once)
- [ ] Sort/filter by language, material, or wishlist status
- [ ] Cover images via Supabase Storage
- [ ] Per-user accounts via Supabase Auth

## License

MIT — feel free to fork, modify, and use for your own household (or anyone else's).