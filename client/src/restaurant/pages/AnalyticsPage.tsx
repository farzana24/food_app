import { Card } from "../../admin/components/ui/card";
import { useRestaurantStore } from "../store/restaurantStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

const colors = ["#f97316", "#fb923c", "#34d399", "#38bdf8", "#a855f7"];

export function AnalyticsPage() {
    const analytics = useRestaurantStore((state) => state.analytics);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Intelligence</p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-slate-500">Spot demand patterns and optimise kitchen throughput.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Top selling dish</p>
                    <p className="text-3xl font-semibold text-slate-900 dark:text-white">{analytics.topSellingDish}</p>
                    <p className="text-xs text-slate-500">Based on last 30 days</p>
                </Card>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Repeat customer rate</p>
                    <p className="text-3xl font-semibold text-slate-900 dark:text-white">{analytics.repeatCustomerRate}%</p>
                    <p className="text-xs text-slate-500">Goal: 70%</p>
                </Card>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Delivery time performance</p>
                    <p className="text-3xl font-semibold text-slate-900 dark:text-white">{analytics.deliveryTimePerformance}%</p>
                    <p className="text-xs text-slate-500">Goal: 85%</p>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Sales by category</p>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={analytics.salesByCategory} innerRadius={80} outerRadius={120} dataKey="value">
                                    {analytics.salesByCategory.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Peak ordering hours</p>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.peakOrderingHours}>
                                <defs>
                                    <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="hour" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Area type="monotone" dataKey="orders" stroke="#34d399" fill="url(#peak)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Monthly overview</p>
                <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.monthlyOverview}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="label" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#a855f7" fill="#c084fc" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
