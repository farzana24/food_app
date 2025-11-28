# Database Seeding

This directory contains the database seed script to populate initial data.

## Admin User Seed

The seed script creates an admin user for accessing the admin dashboard.

### Credentials

- **Email**: admin@ridenbite.com
- **Password**: 123456
- **Role**: ADMIN

### Running the Seed Script

```bash
npm run seed
```

### Prerequisites

1. **PostgreSQL Running**: Ensure your PostgreSQL database is running
2. **Environment Variables**: Make sure `DATABASE_URL` is set in `.env` file
3. **Database Schema**: Run migrations first if you haven't:
   ```bash
   npx prisma migrate dev
   ```

### Troubleshooting

**Error: DATABASE_URL not set**
- Check that `.env` file exists in the server directory
- Verify `DATABASE_URL` is defined

**Error: Authentication failed**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure the database exists

**Error: Table doesn't exist**
- Run migrations first: `npx prisma migrate dev`
- Or generate and push schema: `npx prisma db push`

### What the Script Does

1. Checks if admin user exists with email `admin@ridenbite.com`
2. If exists: Updates the password to `123456`
3. If not exists: Creates new admin user
4. Hashes the password using bcrypt
5. Sets role to `ADMIN`

### Security Note

⚠️ **Change the default password** after first login in production!

The password `123456` is only for development/testing purposes.

## Custom Seeds

You can add more seed data by editing `prisma/seed.ts`:

```typescript
// Add more users
await prisma.user.create({
  data: {
    email: 'test@example.com',
    password: await bcrypt.hash('password', 10),
    name: 'Test User',
    role: 'CUSTOMER',
  },
});

// Add restaurants
await prisma.restaurant.create({
  data: {
    name: 'Test Restaurant',
    address: '123 Main St',
    owner: {
      connect: { id: userId }
    },
    approved: true,
  },
});
```

## Prisma Commands Reference

```bash
# View database in browser
npm run prisma:studio

# Create a migration
npx prisma migrate dev --name description

# Reset database (careful!)
npx prisma migrate reset

# Push schema without migration
npx prisma db push

# Generate Prisma Client
npx prisma generate
```
