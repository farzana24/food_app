import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useRestaurantStore } from "../store/restaurantStore";
import { useRestaurantSocket } from "../hooks/useRestaurantSocket";
import { Toaster } from "../../admin/components/ui/toaster";
import { cn } from "../../admin/utils/helpers";

interface RestaurantLayoutProps {
    children: ReactNode;
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setDarkMode] = useState(() =>
        typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
    );
    const fetchAll = useRestaurantStore((state) => state.fetchAll);
    const loading = useRestaurantStore((state) => state.loading);
    const profileId = useRestaurantStore((state) => state.profile.id);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useRestaurantSocket(profileId);

    const toggleDarkMode = () => {
        if (typeof document === "undefined") return;
        document.documentElement.classList.toggle("dark");
        setDarkMode((prev) => !prev);
    };

    return (
        <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950", isDarkMode && "dark")}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div className="flex flex-1 flex-col lg:ml-72">
                <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} onToggleTheme={toggleDarkMode} isDarkMode={isDarkMode} />
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="h-32 animate-pulse rounded-2xl bg-white/50 shadow-sm dark:bg-slate-900/40" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
            <Toaster />
        </div>
    );
}
