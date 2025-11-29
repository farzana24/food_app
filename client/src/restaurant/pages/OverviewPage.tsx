import { motion } from "framer-motion";
import { Card } from "../../admin/components/ui/card";
import { Badge } from "../../admin/components/ui/badge";
import { useRestaurantStore } from "../store/restaurantStore";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const statCards = [
    { label: "Total orders today", key: "totalOrdersToday", suffix: " orders" },
    { label: "Active orders", key: "activeOrders", suffix: " live" },
    { label: "Earnings today", key: "earningsToday", prefix: "৳" },
    { label: "Pending menu items", key: "pendingMenuItems", suffix: " items" },
] as const;

export function OverviewPage() {
    const stats = useRestaurantStore((state) => state.stats);
    const weeklyEarnings = useRestaurantStore((state) => state.weeklyEarnings);
    const popularDishes = useRestaurantStore((state) => state.popularDishes);
    const orderFrequency = useRestaurantStore((state) => state.orderFrequency);
    const alerts = useRestaurantStore((state) => state.alerts);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Overview</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">RideN'Bite Restaurant HQ</h1>
                <p className="text-sm text-slate-500">Realtime visibility across orders, menu health, and earnings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-amber-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/30">
                            <p className="text-sm font-medium text-slate-500">{card.label}</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                                {card.prefix ?? ""}
                                {stats[card.key]}
                                {card.suffix ?? ""}
                            </p>
                            <p className="text-xs text-emerald-500">+8% vs last week</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="col-span-2 rounded-3xl border border-slate-100 p-6 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Weekly earnings</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">৳56,000 avg</p>
                        </div>
                        <Badge className="rounded-full bg-emerald-100 text-emerald-600">+12% WoW</Badge>
                    </div>
                    <div className="mt-8 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyEarnings}>
                                <defs>
                                    <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="week" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Area type="monotone" dataKey="earnings" stroke="#f59e0b" fill="url(#earnings)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-500">Popular dishes</p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularDishes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#f59e0b" radius={[12, 12, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="col-span-2 rounded-3xl border border-slate-100 p-6 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Order frequency trend</p>
                        <Badge variant="outline" className="rounded-full border-amber-200 text-amber-600">
                            realtime
                        </Badge>
                    </div>
                    <div className="mt-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orderFrequency}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="hour" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-500">Realtime alerts</p>
                    <div className="mt-4 space-y-4">
                        {alerts.slice(0, 4).map((alert) => (
                            <div key={alert.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                                <p className="text-xs text-slate-500">{alert.message}</p>
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                    {new Date(alert.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                        {alerts.length === 0 && <p className="text-xs text-slate-500">All quiet for now.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
}
