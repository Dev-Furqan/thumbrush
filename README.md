# Thumbrush

Premium portfolio website for **Thumbrush**, a YouTube thumbnail and graphic design agency.

The current design follows the original Thumbrush website direction: dark creative agency styling, high-energy neon red accents, bold creator-focused typography, animated stats, featured thumbnail carousel, and image-first portfolio galleries.

Old reference: https://thumbrush.netlify.app/

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- Framer Motion
- React Three Fiber / Three.js
- Prisma ORM
- SQLite for local development
- PostgreSQL-ready production setup
- Secure custom admin login with httpOnly cookies
- Cloudinary uploads with local `/public/uploads` fallback
- Zod validation

## Theme Notes

- Dark premium thumbnail-agency look
- Bright neon red accents on a black/dark red base inspired by the old Thumbrush site
- Large bold headline and gradient emphasis on "Stunning Thumbnails"
- Animated scroll counters
- Image-only featured thumbnail carousel
- Image-only portfolio gallery with category filters and lightbox preview
- Glassmorphism cards, neon borders, soft glow effects, and smooth reveals

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@thumbrush.local"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Run migrations:

```bash
npx prisma migrate dev
```

If Prisma reports local SQLite drift during development, apply the checked-in SQL directly:

```bash
npx prisma db execute --file prisma/migrations/20260614223000_init/migration.sql --schema prisma/schema.prisma
npx prisma db execute --file prisma/migrations/20260615001000_image_only_portfolio/migration.sql --schema prisma/schema.prisma
npx prisma generate
```

5. Seed sample categories and image-only portfolio records:

```bash
npm run prisma:seed
```

6. Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard:

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## Admin Image Upload Workflow

The admin workflow is intentionally simple:

1. Open `/admin`.
2. Choose **Upload Image**.
3. Upload one JPG, JPEG, PNG, or WEBP image up to 5MB.
4. Select a category:
   - Thumbnails
   - Posters
   - Social Posts
   - Logos
   - Branding
5. Optionally mark it as featured.
6. Choose published or draft.
7. Optionally set display order.
8. Save.

No title, description, client name, project date, or external link is required anywhere in admin.

## Featured Thumbnail Carousel

The landing page **Featured Thumbnails** carousel is database-driven.

It only shows portfolio items where:

- `categoryId` is `THUMBNAIL`
- `isFeatured` is `true`
- `isPublished` is `true`

The carousel auto-slides, pauses on hover, includes previous/next arrows, and has pagination dots. It displays images only.

## Portfolio Gallery

The portfolio section shows published images only and sorts them by:

1. `displayOrder` ascending
2. newest first

The gallery supports category filters and lightbox preview. New admin uploads appear automatically after publishing.

## Cloudinary

Cloudinary is optional but recommended for production image hosting.

Set these environment variables:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

When all three variables exist, uploads go to the `thumbrush-portfolio` Cloudinary folder. If any value is missing, uploads are written locally to `/public/uploads`.

When a portfolio item is deleted, the Cloudinary image is deleted too if `imagePublicId` exists.

## Contact Form

The contact section includes a form that posts to:

```text
contact.thumbrush1@gmail.com
```

The form uses FormSubmit (`https://formsubmit.co/contact.thumbrush1@gmail.com`) so messages can be sent to the Thumbrush email without adding a paid email provider. FormSubmit may require a one-time email confirmation the first time the form is used.

## Adding Portfolio Images

No code changes are needed after deployment.

Use the admin dashboard to upload, categorize, feature, publish, unpublish, edit order, or delete portfolio images.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add environment variables from `.env.example`.
4. Use a persistent production database such as Neon, Supabase, Railway, or Vercel Postgres.
5. Configure Cloudinary variables for persistent image hosting.
6. Run migrations during deployment:

```bash
npx prisma migrate deploy
```

7. Deploy.

For PostgreSQL, update the Prisma datasource provider in `prisma/schema.prisma` from:

```prisma
provider = "sqlite"
```

to:

```prisma
provider = "postgresql"
```

## Deploy on Netlify

1. Connect the repo to Netlify.
2. Set build command:

```bash
npm run build
```

3. Set publish directory:

```bash
.next
```

4. Add the same environment variables used locally.
5. Use a hosted database and Cloudinary for persistent production uploads.
6. Run Prisma migrations through your deployment workflow or database release process.

For most Next.js production deployments, Vercel is the simplest path.

## Build

```bash
npm run build
npm run start
```

## Contact Details

- Email: contact.thumbrush1@gmail.com
- Phone / WhatsApp: 03710221411
- WhatsApp link: https://wa.me/923710221411
- X / Twitter: https://x.com/gfxwithak56
