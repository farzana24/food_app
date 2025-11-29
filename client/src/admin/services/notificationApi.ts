import { client } from '../../api/client';
import type { AdminNotification } from '../types';

interface NotificationsPayload {
    notifications: AdminNotification[];
    unreadCount: number;
}

export const notificationApi = {
    async getNotifications(): Promise<NotificationsPayload> {
        const response = await client.get('/admin/notifications');
        return response.data.data;
    },

    async markAsRead(id: number): Promise<void> {
        await client.post(`/admin/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await client.post('/admin/notifications/read-all');
    },
};
