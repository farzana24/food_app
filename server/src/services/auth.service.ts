import { User, Role } from '@prisma/client';
import { hashPassword, comparePassword, generateTokens } from '../utils/auth';
import { prisma } from '../lib/prisma';
import { uploadService } from './uploadService';

export class AuthService {
    async register(data: any) {
        const { email, password, name, phone, role, businessName, address, vehicleType, storefrontImage } = data;

        // Block admin registration
        if (role === 'ADMIN') {
            throw new Error('Admin registration is not allowed');
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(password);

        // Upload storefront image if provided
        let storefrontUrl: string | undefined;
        if (role === 'RESTAURANT' && storefrontImage) {
            try {
                storefrontUrl = await uploadService.uploadImage(storefrontImage, 'restaurants/storefronts');
            } catch (error: any) {
                throw new Error(`Failed to upload storefront image: ${error.message}`);
            }
        }

        // Create user with role-specific profiles in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone,
                    role: (role as Role) || Role.CUSTOMER,
                    emailVerified: true, // Skip email verification for now
                },
            });

            // Create role-specific profile
            if (role === 'RESTAURANT' && businessName && address) {
                // Create both Restaurant (for existing functionality) and RestaurantProfile (for new features)
                const restaurant = await tx.restaurant.create({
                    data: {
                        ownerId: user.id,
                        name: businessName,
                        address,
                        approved: false, // Pending approval
                    },
                });

                await tx.restaurantProfile.create({
                    data: {
                        userId: user.id,
                        businessName,
                        address,
                        cuisine: [],
                        deliveryOptions: [],
                        storefrontImage: storefrontUrl,
                        status: 'PENDING', // Pending approval
                    },
                });
            }

            if (role === 'RIDER') {
                await tx.riderProfile.create({
                    data: {
                        userId: user.id,
                        vehicleType: vehicleType || 'BIKE',
                        availableRegions: [],
                        status: 'ACTIVE', // Auto-approve for now
                    },
                });
            }

            return user;
        });

        const tokens = generateTokens(result.id, result.role);
        return { user: result, tokens };
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

        // If the user is a restaurant, ensure it has been approved
        if (user.role === 'RESTAURANT') {
            const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: user.id } });
            if (!restaurant || restaurant.approved !== true) {
                throw new Error('Restaurant account pending admin approval');
            }
        }

        const tokens = generateTokens(user.id, user.role);
        return { user, tokens };
    }
}
