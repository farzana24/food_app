
import { prisma } from './lib/prisma';

const API_URL = 'http://localhost:4000/api';

async function verifyFlow() {
    const timestamp = Date.now();
    const email = `test_restaurant_${timestamp}@example.com`;
    const password = 'password123';

    console.log(`Starting verification flow for ${email}...`);

    // 1. Register
    console.log('1. Registering restaurant...');
    const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            name: 'Test Owner',
            role: 'RESTAURANT',
            phone: '1234567890',
            businessName: `Test Restaurant ${timestamp}`,
            address: '123 Test St'
        })
    });

    const registerData = await registerRes.json();
    if (!registerData.success) {
        console.error('Registration failed:', registerData);
        process.exit(1);
    }
    console.log('Registration successful.');

    // 2. Login (Should fail)
    console.log('2. Attempting login (expecting failure)...');
    const loginRes1 = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const loginData1 = await loginRes1.json();
    if (loginData1.success) {
        console.error('Login succeeded unexpectedly! Should be pending approval.');
        process.exit(1);
    }

    if (loginData1.message && loginData1.message.includes('pending admin approval')) {
        console.log('Login failed as expected with correct message.');
    } else {
        console.error('Login failed but with unexpected message:', loginData1);
        process.exit(1);
    }

    // 3. Approve Restaurant
    console.log('3. Approving restaurant in database...');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('User not found in DB');
        process.exit(1);
    }

    await prisma.restaurant.update({
        where: { ownerId: user.id },
        data: { approved: true }
    });
    console.log('Restaurant approved.');

    // 4. Login (Should succeed)
    console.log('4. Attempting login (expecting success)...');
    const loginRes2 = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const loginData2 = await loginRes2.json();
    if (loginData2.success) {
        console.log('Login successful!');
        console.log('Token received:', !!loginData2.data.tokens.accessToken);
    } else {
        console.error('Login failed unexpectedly after approval:', loginData2);
        process.exit(1);
    }

    console.log('Verification flow completed successfully.');
    await prisma.$disconnect();
}

verifyFlow().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
