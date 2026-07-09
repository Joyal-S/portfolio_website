# Joyal S — Portfolio

A premium, full-stack portfolio website built with Next.js 14 and Supabase. Features an admin dashboard for managing projects, certificates, achievements, blog posts, and messages.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript (strict)
- **Database:** Supabase Postgres (free tier) with Row Level Security
- **Auth:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (free 1GB)
- **UI:** Tailwind CSS + shadcn/ui components
- **Editor:** TipTap (rich text for blog posts)
- **Animations:** Framer Motion
- **Email:** Resend (free tier, optional)
- **Deployment:** Vercel (free) / Netlify (free)

## Features

- **Public Pages:** Home, Projects (filterable), Certificates, Achievements, Blog (with rich text), About, Contact
- **Admin Dashboard:** Protected CRUD for all content types
- **Design:** Dark premium theme with purple/indigo accents, glassmorphism, subtle animations
- **SEO:** Metadata, sitemap, robots.txt, Open Graph
- **Mobile:** Fully responsive with mobile navigation

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A free Supabase account (https://supabase.com)
- (Optional) A free Resend API key for contact form emails

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** and run the migration in `supabase/migrations/00001_schema.sql`
3. Go to **Authentication > Settings** and enable email/password sign-in
4. Create a user for admin access in **Authentication > Users**
5. Go to **Storage** and create three buckets: `projects`, `certificates`, `posts` (public read, authenticated write)

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_xxx (optional)
CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Generate Types (optional but recommended)

```bash
npm run gen:types
```

### 6. Run

```bash
npm run dev
```

### 7. Admin Access

Navigate to `/admin/login` and sign in with the email/password you created in Supabase Auth.

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The site will automatically rebuild when you push changes.

## Deploy to Netlify

1. Push your code to GitHub
2. Import the repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add all environment variables
6. Deploy

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public-facing pages
│   └── admin/             # Admin dashboard pages
├── components/
│   ├── ui/               # shadcn UI primitives
│   ├── layout/           # Header, Footer, Container
│   └── shared/           # Reusable section components
├── features/             # Feature-based modules
│   ├── projects/
│   ├── certificates/
│   ├── achievements/
│   ├── blog/
│   ├── contact/
│   └── auth/
├── lib/                  # Utilities and configuration
│   └── supabase/        # Supabase client variants
└── types/               # TypeScript type definitions
```

## Admin Pages

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with content stats |
| `/admin/projects` | Manage projects (CRUD) |
| `/admin/certificates` | Manage certificates (CRUD) |
| `/admin/achievements` | Manage achievements (CRUD) |
| `/admin/blog` | Manage blog posts (CRUD + TipTap editor) |
| `/admin/messages` | View contact form messages |

## License

MIT
