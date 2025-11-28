import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { mockApi } from "../services/mockData";
import { formatDateTime } from "../utils/helpers";
import type { AuditLog } from "../types";
import { Save } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

export function Settings() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("BDT");
    const [deliveryFee, setDeliveryFee] = useState("50");
    const { toast } = useToast();

    useEffect(() => {
        loadAuditLogs();
    }, []);

    async function loadAuditLogs() {
        try {
            const response = await mockApi.getAuditLogs({ limit: 10 });
            setAuditLogs(response.data);
        } catch (error) {
            console.error("Failed to load audit logs:", error);
        } finally {
            setLoading(false);
        }
    }

    const saveSettings = () => {
        toast({
            title: "Settings Saved",
            description: "Platform settings have been updated successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-slate-500">Configure platform-wide settings and view audit logs</p>
            </div>

            {/* Platform Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage currencies and delivery fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">Default Currency</label>
                            <Input
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Base Delivery Fee (৳)</label>
                            <Input
                                type="number"
                                value={deliveryFee}
                                onChange={(e) => setDeliveryFee(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <Button onClick={saveSettings}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
                <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>Recent administrative actions</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity Type</TableHead>
                                    <TableHead>Entity ID</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.userName}</TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.entityType}</TableCell>
                                        <TableCell>#{log.entityId}</TableCell>
                                        <TableCell className="text-slate-500">{log.details}</TableCell>
                                        <TableCell className="text-slate-500">
                                            {formatDateTime(log.timestamp)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
