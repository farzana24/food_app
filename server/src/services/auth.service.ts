import { User, Role } from '@prisma/client';
import { hashPassword, comparePassword, generateTokens } from '../utils/auth';
import { prisma } from '../lib/prisma';

export class AuthService {
    async register(data: any) {
        const { email, password, name, role } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role as Role || Role.CUSTOMER,
            },
        });

        const tokens = generateTokens(user.id, user.role);
        return { user, tokens };
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const tokens = generateTokens(user.id, user.role);
        return { user, tokens };
    }
}
