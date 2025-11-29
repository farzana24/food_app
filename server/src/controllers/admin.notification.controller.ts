import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class AdminNotificationController {
    async list(req: Request, res: Response) {
        try {
            const [notifications, unreadCount] = await Promise.all([
                prisma.adminNotification.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 25,
                    include: {
                        restaurant: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                }),
                prisma.adminNotification.count({ where: { read: false } }),
            ]);

            res.json({
                success: true,
                data: { notifications, unreadCount },
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to load notifications',
                error: error.message,
            });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.adminNotification.update({
                where: { id: parseInt(id, 10) },
                data: { read: true },
            });

            res.json({ success: true, message: 'Notification marked as read' });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update notification',
                error: error.message,
            });
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            await prisma.adminNotification.updateMany({
                where: { read: false },
                data: { read: true },
            });

            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to mark notifications as read',
                error: error.message,
            });
        }
    }
}
