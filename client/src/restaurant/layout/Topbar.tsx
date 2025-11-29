import { useEffect, useRef, useState } from "react";
import { Menu, Bell, Search, Sun, Moon, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "../../admin/components/ui/button";
import { Input } from "../../admin/components/ui/input";
import { Badge } from "../../admin/components/ui/badge";
import { useRestaurantStore } from "../store/restaurantStore";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
    onToggleSidebar: () => void;
    onToggleTheme: () => void;
    isDarkMode: boolean;
}

export function Topbar({ onToggleSidebar, onToggleTheme, isDarkMode }: TopbarProps) {
    const alerts = useRestaurantStore((state) => state.alerts);
    const { user } = useAuth();
    const [alertsOpen, setAlertsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(alerts.length);
    const alertsRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!alertsOpen) return;
        const handleClick = (event: MouseEvent) => {
            if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
                setAlertsOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setAlertsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [alertsOpen]);

    useEffect(() => {
        setUnreadCount((prev) => (alerts.length > prev ? alerts.length : prev));
    }, [alerts]);

    const toggleAlerts = () => {
        setAlertsOpen((prev) => {
            const next = !prev;
            if (!prev) {
                setUnreadCount(0);
            }
            return next;
        });
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 px-4 py-2 dark:border-slate-800 lg:flex">
                    <Search className="h-4 w-4 text-slate-400" />
                    <Input placeholder="Quick search" className="border-none bg-transparent p-0 shadow-none" />
                </div>
                <div className="flex flex-1 items-center justify-end gap-3">
                    <Button variant="ghost" size="icon" onClick={onToggleTheme}>
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <div className="relative" ref={alertsRef}>
                        <Button variant="secondary" className="relative" onClick={toggleAlerts} aria-expanded={alertsOpen}>
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge className="pointer-events-none absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                                    {unreadCount}
                                </Badge>
                            )}
                            <span className="ml-2 hidden text-xs uppercase tracking-wide text-slate-500 md:inline">
                                Alerts
                            </span>
                        </Button>
                        {alertsOpen && (
                            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Realtime alerts</p>
                                    <button
                                        className="text-xs font-medium uppercase tracking-wide text-amber-600"
                                        onClick={() => setUnreadCount(0)}
                                    >
                                        Mark read
                                    </button>
                                </div>
                                <div className="mt-3 space-y-3">
                                    {alerts.slice(0, 5).map((alert) => (
                                        <div key={alert.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.title}</p>
                                            <p className="text-xs text-slate-500">{alert.message}</p>
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                {new Date(alert.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                    {alerts.length === 0 && (
                                        <p className="text-xs text-slate-500">No alerts yet. You're all caught up.</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    className="mt-4 w-full text-xs font-semibold uppercase tracking-wide text-amber-600"
                                    onClick={() => {
                                        setAlertsOpen(false);
                                        navigate("/restaurant/orders");
                                    }}
                                >
                                    Go to orders
                                </Button>
                            </div>
                        )}
                    </div>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 dark:border-slate-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-600">
                                    {user?.name?.[0] ?? "R"}
                                </div>
                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                                        {user?.name ?? "Restaurant"}
                                    </p>
                                    <p className="text-xs text-slate-500">{user?.role}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="w-56 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    onSelect={(event) => {
                                        event.preventDefault();
                                        navigate("/restaurant/profile");
                                    }}
                                >
                                    View profile
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    onSelect={(event) => {
                                        event.preventDefault();
                                        navigate("/restaurant/settings");
                                    }}
                                >
                                    Restaurant settings
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
        </header>
    );
}
