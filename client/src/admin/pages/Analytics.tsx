import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockApi } from "../services/mockData";
import { formatCurrency } from "../utils/helpers";
import type { AnalyticsData } from "../types";
import { Download } from "lucide-react";

export function Analytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        try {
            const data = await mockApi.getAnalytics({ period: "30d" });
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    }

    const exportCSV = () => {
        console.log("Exporting CSV...");
        alert("CSV export would download here");
    };

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg text-slate-500">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                        <p className="text-slate-500">Platform performance metrics and insights</p>
                    </div>
                    <Button onClick={exportCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Daily revenue over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.revenues}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="amount" name="Revenue" stroke="#0088FE" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Delivery Time Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Time Performance</CardTitle>
                        <CardDescription>Average delivery time in minutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.deliveryTimes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="avgMinutes"
                                    name="Avg Time (min)"
                                    stroke="#00C49F"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Dishes Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Dishes</CardTitle>
                        <CardDescription>Most popular items by order count</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.topDishes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" name="Orders" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
