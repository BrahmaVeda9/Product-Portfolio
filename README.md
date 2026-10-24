# Product Manager Portfolio + Admin CMS

A production-ready personal portfolio website for a Product Manager, with a built-in private Admin CMS — all in one Next.js application.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + PostgreSQL + Storage) · Vercel

---

## Features

### Public Portfolio
- Home with animated hero, expertise areas, and featured projects
- About page with profile photo and bio
- Work Experience timeline
- Projects/Case Studies with category filters
- Individual project pages (problem → approach → decisions → outcomes → metrics)
- Skills page with proficiency bars
- Contact page
- SEO: `sitemap.xml`, `robots.txt`, Open Graph meta per page
- Fully responsive (mobile + desktop)

### Admin CMS (`/admin`)
- Secure Supabase email/password login
- Server-side + middleware authentication (not security-by-obscurity)
- Dashboard overview with content checklist
- Profile editor (bio, headline, keywords, avatar, resume upload)
- Projects: create, edit, delete, reorder, feature, draft/publish
- Full case study editor (problem, approach, decisions, solution, outcomes, SEO meta)
- Image upload for thumbnails via Supabase Storage
- Experience CRUD (company, role, dates, achievements)
- Skills CRUD (category, proficiency slider)
- Confirm before destructive actions
- Toast notifications for all operations

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/en/download) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- A [GitHub](https://github.com) account

---

## 1. Install Node.js

Download and install from **https://nodejs.org/en/download** (choose LTS).

After installation, verify:
```bash
node --version   # Should print v18.x or higher
npm --version    # Should print 9.x or higher
```

---

## 2. Clone & Install Dependencies

```bash
# In the project folder
npm install
```

---

## 3. Set Up Supabase

### 3a. Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) → **New project**
2. Note your **Project URL** and **anon key** (Settings → API)
3. Note your **service_role key** (Settings → API → keep this secret!)

### 3b. Run Database Migrations
1. Go to **Supabase Dashboard → SQL Editor**
2. Paste and run `supabase/migrations/001_create_tables.sql`
3. Paste and run `supabase/migrations/002_rls_policies.sql`

### 3c. Create the Storage bucket
1. Go to **Supabase Dashboard → Storage → New bucket**
2. Name it: `portfolio-assets`
3. Make it **Public**
4. Go to **Storage → Policies** and add:
   - Public read: `SELECT` for all users on `portfolio-assets`
   - Authenticated write: `INSERT`, `UPDATE`, `DELETE` for authenticated users

### 3d. Create your admin user
1. Go to **Supabase Dashboard → Authentication → Users → Invite user** (or use the signup API)
2. Sign up with your email and password
3. Copy the **user UUID** from the users list — you'll need it for `ADMIN_USER_ID`

---

## 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_USER_ID=your-supabase-user-uuid
```

> ⚠️ **Never commit `.env.local` to Git.** It is already in `.gitignore`.

---

## 5. Run Locally

```bash
npm run dev
```

Open **http://localhost:3000** for the portfolio.
Open **http://localhost:3000/admin** for the admin dashboard.

---

## 6. Push to GitHub

```bash
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/your-username/product-portfolio.git
git push -u origin main
```

---

## 7. Deploy to Vercel

### Via Vercel Dashboard (Recommended)
1. Go to [https://vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Go to **Settings → Environment Variables** and add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel domain, e.g. `https://your-portfolio.vercel.app`
   - `ADMIN_USER_ID`
4. Deploy → Vercel will build and host automatically

### Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 8. Post-Deployment Steps

After deploying:

1. **Update `NEXT_PUBLIC_SITE_URL`** in Vercel env vars to your live domain
2. **Supabase → Authentication → URL Configuration** → add your Vercel domain to:
   - **Site URL**: `https://your-portfolio.vercel.app`
   - **Redirect URLs**: `https://your-portfolio.vercel.app/**`
3. Trigger a redeploy so the new env var takes effect

---

## 9. Populate Your Content

Log in to `/admin` with your Supabase credentials and:

1. **Profile** → Add name, headline, bio, location, email, LinkedIn, keywords
2. **Profile** → Upload avatar photo and resume PDF
3. **Experience** → Add each role, date range, and achievements
4. **Skills** → Add skills grouped by category with proficiency levels
5. **Projects** → Create case studies; set `featured = true` for up to 3 to show on homepage
6. **Projects** → Publish projects when ready

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public portfolio pages
│   ├── admin/             # Protected admin CMS
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Auto-generated sitemap
│   ├── robots.ts          # robots.txt
│   └── not-found.tsx      # 404 page
├── components/
│   ├── public/            # Portfolio UI components
│   └── admin/             # Admin UI components
├── lib/
│   └── supabase/          # Supabase clients + middleware
├── types/
│   └── database.types.ts  # TypeScript types
└── middleware.ts           # Auth middleware
supabase/
└── migrations/            # SQL schema + RLS policies
```

---

## Security Notes

- `/admin` is protected at **three levels**: Next.js middleware, admin layout server component, and Supabase RLS
- The service role key is **server-only** — never sent to the browser
- RLS policies ensure **anonymous users can only read published content**
- `ADMIN_USER_ID` adds an extra authorization check beyond authentication
- Admin URL is not relied upon for security — all operations require a valid session

---

## Implementation Checklist

| Feature | Status |
|---|---|
| Public portfolio (Home, About, Experience, Projects, Skills, Contact) | ✅ |
| Individual project case study pages | ✅ |
| Supabase Auth + session middleware | ✅ |
| Admin login/logout | ✅ |
| Admin dashboard with stats | ✅ |
| Profile editor + file upload | ✅ |
| Projects CRUD + publish/draft toggle | ✅ |
| Case study editor (all sections) | ✅ |
| Experience CRUD | ✅ |
| Skills CRUD | ✅ |
| Thumbnail upload via Supabase Storage | ✅ |
| RLS policies | ✅ |
| SEO: title/meta per page | ✅ |
| Open Graph metadata | ✅ |
| sitemap.xml | ✅ |
| robots.txt | ✅ |
| 404 page | ✅ |
| Responsive mobile layout | ✅ |
| Confirm before destructive actions | ✅ |
| Toast notifications | ✅ |
| .env.example | ✅ |
| README with deployment instructions | ✅ |

### Manual Steps Required
- [ ] Install Node.js 18+ from nodejs.org
- [ ] Create Supabase project
- [ ] Run SQL migrations in Supabase SQL Editor
- [ ] Create `portfolio-assets` storage bucket + policies
- [ ] Create your admin user in Supabase Auth
- [ ] Copy `.env.example` → `.env.local` and fill in values
- [ ] Push to GitHub
- [ ] Deploy to Vercel and set environment variables
- [ ] Update Supabase Auth → URL Configuration with your live domain
- [ ] Populate content via `/admin`
