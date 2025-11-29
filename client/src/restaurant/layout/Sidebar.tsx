import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { restaurantNav, navFooter } from "../constants/navigation";
import { Button } from "../../admin/components/ui/button";
import { cn } from "../../admin/utils/helpers";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 z-40 w-72 border-r border-slate-100 bg-white/90 p-6 backdrop-blur-lg transition-transform dark:border-slate-800 dark:bg-slate-900/90 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex items-center justify-between">
                <Link to="/restaurant" className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-500">RideN'Bite</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">Kitchen Console</p>
                </Link>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <nav className="mt-10 space-y-1">
                {restaurantNav.map((item) => {
                    const currentPath = location.pathname.replace(/\/$/, "") || "/";
                    const targetPath = item.href.replace(/\/$/, "");
                    const isDashboard = targetPath === "/restaurant";
                    const active = isDashboard
                        ? currentPath === targetPath
                        : currentPath.startsWith(targetPath);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                active
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            )}
                            onClick={onClose}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-10 space-y-2 border-t border-slate-100 pt-6 dark:border-slate-800">
                {navFooter.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                            onClick={handleLogout}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
