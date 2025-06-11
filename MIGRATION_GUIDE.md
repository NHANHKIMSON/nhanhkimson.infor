# Database Migration Guide

## Migration Methods

### 1. **First Time Setup** (Recommended for new projects)
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to database (no migration files)
npx prisma db push

# Seed with sample data
npm run db:setup
\`\`\`

### 2. **Development Migration** (Recommended for development)
\`\`\`bash
# Create and apply migration
npx prisma migrate dev --name your_migration_name

# Example:
npx prisma migrate dev --name add_user_table
npx prisma migrate dev --name update_project_schema
\`\`\`

### 3. **Production Migration** (For production deployments)
\`\`\`bash
# Apply pending migrations
npx prisma migrate deploy
\`\`\`

### 4. **Check Migration Status**
\`\`\`bash
# Check current migration status
npm run db:check

# Or use Prisma command
npx prisma migrate status
\`\`\`

### 5. **Safe Migration** (Preserves existing data)
\`\`\`bash
# Backup data, migrate, and restore if needed
npm run db:safe-migrate
\`\`\`

### 6. **Full Reset** (⚠️ Deletes all data)
\`\`\`bash
# Complete reset with fresh data
npm run db:reset
\`\`\`

## Common Migration Scenarios

### Scenario 1: Adding a new field to existing table
1. Update your `schema.prisma` file
2. Run: `npx prisma migrate dev --name add_new_field`

### Scenario 2: Creating a new table
1. Add new model to `schema.prisma`
2. Run: `npx prisma migrate dev --name add_new_table`

### Scenario 3: Changing field types (⚠️ Data loss possible)
1. Update field type in `schema.prisma`
2. Run: `npm run db:safe-migrate` (recommended)
3. Or: `npx prisma migrate dev --name change_field_type`

### Scenario 4: Production deployment
1. Test migrations in development first
2. Run: `npx prisma migrate deploy` on production
3. Restart your application

## Migration Best Practices

1. **Always backup production data** before migrations
2. **Test migrations in development** first
3. **Use descriptive migration names**: `add_user_avatar`, `update_project_schema`
4. **Review generated SQL** before applying to production
5. **Use `db push` for prototyping**, `migrate dev` for versioned changes

## Troubleshooting

### Migration failed?
\`\`\`bash
# Check what went wrong
npx prisma migrate status

# Reset and try again
npx prisma migrate reset
npm run db:setup
\`\`\`

### Schema out of sync?
\`\`\`bash
# Force push schema (⚠️ may lose data)
npx prisma db push --force-reset

# Or create a migration to fix it
npx prisma migrate dev --name fix_schema_sync
\`\`\`

### Need to start fresh?
\`\`\`bash
# Complete reset
npm run db:reset
