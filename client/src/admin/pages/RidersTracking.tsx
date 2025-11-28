import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { mockApi } from "../services/mockData";
import type { RiderData } from "../types";
import { MapPin } from "lucide-react";

export function RidersTracking() {
    const [riders, setRiders] = useState<RiderData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRiders();
        // Simulate real-time updates
        const interval = setInterval(loadRiders, 10000);
        return () => clearInterval(interval);
    }, []);

    async function loadRiders() {
        try {
            const response = await mockApi.getRiders({});
            setRiders(response.data);
        } catch (error) {
            console.error("Failed to load riders:", error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusBadgeVariant = (status: RiderData["status"]) => {
        switch (status) {
            case "IDLE":
                return "success";
            case "BUSY":
                return "warning";
            case "OFFLINE":
                return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Riders & Live Tracking</h1>
                <p className="text-slate-500">Monitor active riders and their locations</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Riders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{riders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {riders.filter((r) => r.status === "IDLE" || r.status === "BUSY").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>On Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                            {riders.filter((r) => r.status === "BUSY").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Map Placeholder */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Live Map</CardTitle>
                        <CardDescription>Rider locations in real-time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="text-center text-slate-500">
                                <MapPin className="mx-auto h-12 w-12 mb-2" />
                                <p>Map view placeholder</p>
                                <p className="text-sm">Integrate with Leaflet for live tracking</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Riders List */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Active Riders</CardTitle>
                        <CardDescription>All riders and their current status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <p className="text-slate-500">Loading...</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rider</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Location</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {riders.map((rider) => (
                                            <TableRow key={rider.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{rider.userName}</div>
                                                        <div className="text-sm text-slate-500">{rider.userEmail}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(rider.status) as any}>
                                                        {rider.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-500">
                                                    {rider.lat && rider.lng
                                                        ? `${rider.lat.toFixed(4)}, ${rider.lng.toFixed(4)}`
                                                        : "Unknown"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
