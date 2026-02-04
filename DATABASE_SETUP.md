# Database Setup Guide

This guide covers setting up and using the database for Martin Doks Homes.

## Current Setup

The application currently uses **JSON file storage** by default. You can optionally migrate to **PostgreSQL** for production use.

## Using JSON Files (Default)

The application works out of the box with JSON files stored in the `data/` directory:
- `admin-users.json` - Admin user accounts
- `blog-posts.json` - Blog posts
- `properties.json` - Property listings
- `testimonials.json` - Client testimonials
- `newsletter-subscribers.json` - Newsletter subscribers

No setup required - the application will create these files automatically.

## Migrating to PostgreSQL (Optional)

### Prerequisites

1. PostgreSQL database (local or cloud-hosted)
2. Database connection string

### Setup Steps

1. **Set up your database:**
   ```bash
   # Create a PostgreSQL database
   # Get your connection string (format: postgresql://user:password@host:port/database)
   ```

2. **Configure environment variables:**
   Create or update `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   USE_DATABASE=false  # Set to true after migration
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Push database schema:**
   ```bash
   npm run db:push
   ```

5. **Migrate data from JSON files:**
   ```bash
   npm run db:migrate
   ```
   This will:
   - Create a backup of your JSON files
   - Migrate all data to PostgreSQL
   - Verify the migration

6. **Verify migration:**
   ```bash
   npm run db:verify
   ```

7. **Enable database mode:**
   Update `.env.local`:
   ```env
   USE_DATABASE=true
   ```

8. **Restart your application**

## Database Schema

The Prisma schema is located at `prisma/schema.prisma`. It includes:
- Admin Users
- Blog Posts
- Properties
- Testimonials
- Newsletter Subscribers
- Activity Logs
- Content Versions
- Media Files
- Content Templates
- Analytics Events

## Useful Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Migrate JSON data to PostgreSQL
- `npm run db:verify` - Verify migration was successful
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Important Notes

- **Backups**: The migration script automatically creates backups of JSON files
- **Testing**: Always test migrations in a development environment first
- **Rollback**: If something goes wrong, you can restore from the backup files
- **Dual Mode**: The application can work with both JSON files and database simultaneously during migration

## Troubleshooting

### Prisma Client not found
Run `npm run db:generate` to generate the Prisma Client.

### Connection errors
- Verify your `DATABASE_URL` is correct
- Ensure your database server is running
- Check firewall/network settings

### Migration fails
- Check the backup files in `data/backups/`
- Review error messages in the console
- Ensure database schema matches Prisma schema

