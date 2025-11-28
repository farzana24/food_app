import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection setup
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('Please set it in your .env file');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...');

    // Safe to use connectionString here since we checked it exists above
    const dbInfo = connectionString!.split('@')[1]?.split('?')[0] || 'configured';
    console.log(`📦 Database: ${dbInfo}`);

    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@ridenbite.com' },
    });

    if (existingAdmin) {
        console.log('⚠️  Admin user already exists. Updating password...');
        await prisma.user.update({
            where: { email: 'admin@ridenbite.com' },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin user password updated!');
    } else {
        console.log('👤 Creating admin user...');
        await prisma.user.create({
            data: {
                email: 'admin@ridenbite.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin user created successfully!');
    }

    console.log('\n📝 Admin Credentials:');
    console.log('   Email: admin@ridenbite.com');
    console.log('   Password: 123456');
    console.log('   Role: ADMIN');
    console.log('\n✨ Seeding completed!');
}

main()
    .catch((e: any) => {
        console.error('❌ Error during seeding:', e.message);
        if (e.code === 'P1000') {
            console.log('\n💡 Tip: Check your DATABASE_URL in .env file');
            console.log('   Make sure PostgreSQL is running and credentials are correct');
        }
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
