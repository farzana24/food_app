import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { useAuth } from "../../../context/AuthContext";
import { notificationApi } from "../../services/notificationApi";
import type { AdminNotification } from "../../types";

interface TopbarProps {
    onSearch?: (query: string) => void;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export function Topbar({ onSearch, darkMode, onToggleDarkMode }: TopbarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [notificationError, setNotificationError] = useState<string | null>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        setLoadingNotifications(true);
        try {
            const data = await notificationApi.getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
            setNotificationError(null);
        } catch (error) {
            console.error("Failed to load notifications", error);
            setNotificationError("Unable to load notifications");
        } finally {
            setLoadingNotifications(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const markAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search orders, restaurants, users..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Dark Mode Toggle */}
                    {onToggleDarkMode && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleDarkMode}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                    )}

                    {/* Notifications */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowNotifications(true)}
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {Math.min(unreadCount, 99)}
                                </Badge>
                            )}
                        </Button>
                    </div>

                    {/* Profile Menu */}
                    <Button variant="ghost" size="icon" aria-label="Profile">
                        <User className="h-5 w-5" />
                    </Button>

                    {/* Logout */}
                    <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Notifications Dialog */}
            <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notifications</DialogTitle>
                        <DialogDescription>
                            {notificationError
                                ? notificationError
                                : unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : "You're all caught up"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {loadingNotifications ? (
                            <p className="text-sm text-slate-500">Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-sm text-slate-500">No notifications yet.</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-lg border p-3 dark:border-slate-800 ${notification.read ? 'opacity-70' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {notification.message}
                                            </p>
                                            {notification.restaurant?.name && (
                                                <p className="text-xs text-slate-400">
                                                    Restaurant: {notification.restaurant.name}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={markAllRead} disabled={unreadCount === 0}>
                            Mark all as read
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
