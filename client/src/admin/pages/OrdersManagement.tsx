import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { mockApi } from "../services/mockData";
import { formatCurrency, formatDateTime, getRelativeTime } from "../utils/helpers";
import type { OrderData, OrderStatus } from "../types";
import { Search, Eye, Ban, RefreshCw, MapPin } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

const statusOptions: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "ASSIGNED",
    "PICKED_UP",
    "DELIVERED",
    "CANCELLED",
];

export function OrdersManagement() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [orderDetailOpen, setOrderDetailOpen] = useState(false);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<"reassign" | "cancel" | "refund">("cancel");
    const { toast } = useToast();

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    async function loadOrders() {
        setLoading(true);
        try {
            const params = {
                status: statusFilter || undefined,
                limit: 50,
            };
            const response = await mockApi.getOrders(params);
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.id.toString().includes(query) ||
            order.userName.toLowerCase().includes(query) ||
            order.restaurantName.toLowerCase().includes(query)
        );
    });

    const getStatusBadgeVariant = (status: OrderStatus) => {
        switch (status) {
            case "DELIVERED":
                return "success";
            case "CANCELLED":
                return "destructive";
            case "PENDING":
            case "CONFIRMED":
                return "warning";
            default:
                return "default";
        }
    };

    const viewOrderDetail = async (order: OrderData) => {
        setSelectedOrder(order);
        setOrderDetailOpen(true);
    };

    const openActionDialog = (order: OrderData, action: "reassign" | "cancel" | "refund") => {
        setSelectedOrder(order);
        setCurrentAction(action);
        setActionDialogOpen(true);
    };

    const handleAction = async () => {
        if (!selectedOrder) return;

        try {
            await mockApi.updateOrderStatus(selectedOrder.id, currentAction, {});

            toast({
                title: "Action Completed",
                description: `Order #${selectedOrder.id} has been ${currentAction}ed.`,
            });

            setActionDialogOpen(false);
            loadOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${currentAction} order.`,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-slate-500">
                    Monitor and manage all platform orders
                </p>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>
                                {filteredOrders.length} total orders
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                            >
                                <option value="">All Statuses</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
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
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Restaurant</TableHead>
                                    <TableHead>Rider</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>{order.userName}</TableCell>
                                        <TableCell>{order.restaurantName}</TableCell>
                                        <TableCell>
                                            {order.riderName || (
                                                <span className="text-slate-400">Not assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status) as any}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatCurrency(order.totalCents, order.currency)}</TableCell>
                                        <TableCell className="text-slate-500">
                                            {getRelativeTime(order.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => viewOrderDetail(order)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openActionDialog(order, "reassign")}
                                                            title="Reassign rider"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openActionDialog(order, "cancel")}
                                                            title="Cancel order"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
                        <DialogDescription>
                            Order placed {selectedOrder && formatDateTime(selectedOrder.createdAt)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Customer</h3>
                                    <p>{selectedOrder.userName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Restaurant</h3>
                                    <p>{selectedOrder.restaurantName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Rider</h3>
                                    <p>{selectedOrder.riderName || "Not assigned"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Status</h3>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.status) as any}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Order Timeline</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span>Order Placed - {formatDateTime(selectedOrder.createdAt)}</span>
                                    </div>
                                    {selectedOrder.status !== "PENDING" && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>Confirmed - {formatDateTime(selectedOrder.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Delivery Location</h3>
                                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin className="h-4 w-4" />
                                        <span>Map view placeholder - integrate with Leaflet</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedOrder.totalCents, selectedOrder.currency)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOrderDetailOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Dialog */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {currentAction === "reassign"
                                ? "Reassign Rider"
                                : currentAction === "cancel"
                                    ? "Cancel Order"
                                    : "Process Refund"}
                        </DialogTitle>
                        <DialogDescription>
                            {currentAction === "reassign"
                                ? `Assign a new rider to order #${selectedOrder?.id}`
                                : currentAction === "cancel"
                                    ? `Cancel order #${selectedOrder?.id}. This action cannot be undone.`
                                    : `Process a refund for order #${selectedOrder?.id}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {currentAction === "reassign" && (
                            <div>
                                <label className="text-sm font-medium">Select Rider</label>
                                <select className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950">
                                    <option>Rider 1</option>
                                    <option>Rider 2</option>
                                    <option>Rider 3</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                className="mt-1 w-full rounded-md border border-slate-200 p-2 text-sm dark:border-slate-800"
                                rows={3}
                                placeholder="Add any notes..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAction}>
                            Confirm {currentAction}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
