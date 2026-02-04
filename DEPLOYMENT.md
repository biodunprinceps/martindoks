# Deployment Guide

Essential information for deploying Martin Doks Homes to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured (`.env.local` or production environment)
- [ ] Database setup (if using PostgreSQL)
- [ ] Image assets uploaded to `public/images/`
- [ ] Build tested locally (`npm run build`)
- [ ] All sensitive data removed from codebase

## Environment Variables

Create a `.env.local` file (or configure in your hosting platform):

```env
# Database (optional - defaults to JSON files)
DATABASE_URL="postgresql://user:password@host:port/database"
USE_DATABASE=false

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key"

# Application
NODE_ENV="production"
```

## Build and Deploy

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   # or
   npm run start:next
   ```

## File Structure

Ensure these directories exist and are writable:
- `data/` - JSON file storage (if not using database)
- `public/uploads/` - User-uploaded images
- `public/uploads/blog/` - Blog post images
- `public/uploads/properties/` - Property images
- `public/uploads/testimonials/` - Testimonial images

## Production Considerations

### Security
- Use strong passwords for admin accounts
- Enable HTTPS/SSL
- Keep dependencies updated
- Review and restrict file uploads
- Use environment variables for sensitive data

### Performance
- Enable image optimization (Next.js handles this automatically)
- Use a CDN for static assets
- Consider database migration for better performance
- Monitor server resources

### Monitoring
- Set up error logging
- Monitor server uptime
- Track API usage
- Review analytics

## Common Deployment Platforms

### Vercel
1. Connect your repository
2. Add environment variables
3. Deploy automatically on push

### cPanel/Shared Hosting
**See `CPANEL_DEPLOYMENT.md` for detailed step-by-step instructions.**

Quick steps:
1. Upload files via FTP
2. Set up Node.js application in cPanel
3. Configure environment variables (`NODE_ENV=production`, `PORT=3000`)
4. Run `npm install` (ignore content-type warning if it appears)
5. **IMPORTANT:** Run `npm run build` manually
6. Start with `npm start`

**Note:** cPanel checks the app after `npm install`, but Next.js requires a build step first. This is normal - just continue with the build step.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Post-Deployment

1. Test all admin functions
2. Verify image uploads work
3. Test contact forms
4. Check newsletter subscription
5. Verify email sending (if configured)
6. Test on mobile devices

## Troubleshooting

### Build fails
- Check Node.js version (requires 18+)
- Review build errors in console
- Ensure all dependencies are installed

### Images not loading
- Verify `public/images/` directory exists
- Check file permissions
- Ensure image paths are correct

### Database errors
- Verify `DATABASE_URL` is correct
- Check database connection
- Review Prisma schema matches database

### Email not sending
- Verify `RESEND_API_KEY` is set
- Check Resend account status
- Review email templates

