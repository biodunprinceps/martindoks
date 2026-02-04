# Quick Start Guide

Get up and running with Martin Doks Homes quickly.

## Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Initial Setup



**Important:** Change these credentials before deploying to production!

### 2. Add Content

- **Blog Posts**: `/admin/blog/new`
- **Properties**: `/admin/properties/new`
- **Testimonials**: `/admin/testimonials/new`

### 3. Upload Images

Images can be uploaded through the admin interface:
- Blog featured images
- Property photos
- Testimonial photos

Images are stored in `public/uploads/` directory.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:turbo        # Start with Turbopack

# Production
npm run build            # Build for production
npm start                # Start production server

# Database (if using PostgreSQL)
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Migrate JSON data to database
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
# Optional: Database
DATABASE_URL="postgresql://..."
USE_DATABASE=false

# Optional: Email (Resend)
RESEND_API_KEY="your_key"
```

### Default Setup

The application works out of the box with:
- JSON file storage (no database required)
- File-based image uploads
- Basic email functionality

## Next Steps

1. **Customize content** - Update blog posts, properties, testimonials
2. **Add images** - Upload property photos and blog images
3. **Configure email** - Set up Resend for newsletter and contact forms
4. **Review security** - Change default admin password
5. **Deploy** - See `DEPLOYMENT.md` for production deployment

## Getting Help

- Check `DEPLOYMENT.md` for deployment instructions
- See `DATABASE_SETUP.md` for database configuration
- Review code comments for implementation details

