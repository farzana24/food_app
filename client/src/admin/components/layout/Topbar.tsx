import { useState } from "react";
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

interface TopbarProps {
    onSearch?: (query: string) => void;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export function Topbar({ onSearch, darkMode, onToggleDarkMode }: TopbarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationCount = 3;
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
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
                            {notificationCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {notificationCount}
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
                            You have {notificationCount} unread notifications
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium">New Restaurant Pending</p>
                                    <p className="text-sm text-slate-500">
                                        Tasty Bites is waiting for approval
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400">5m ago</span>
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium">Order Issue Reported</p>
                                    <p className="text-sm text-slate-500">
                                        Order #1234 requires attention
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400">15m ago</span>
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium">System Update</p>
                                    <p className="text-sm text-slate-500">
                                        New features available
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400">1h ago</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowNotifications(false)}>
                            Mark all as read
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
