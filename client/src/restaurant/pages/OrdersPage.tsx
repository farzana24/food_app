import { useMemo, useState } from "react";
import { Button } from "../../admin/components/ui/button";
import { Badge } from "../../admin/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../admin/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../admin/components/ui/dialog";
import { useRestaurantStore } from "../store/restaurantStore";
import type { RestaurantOrder, OrderStatus } from "../types";
import Map from "../../components/Map";

const statusFlow: OrderStatus[] = ["PENDING", "ACCEPTED", "COOKING", "READY_FOR_PICKUP", "COMPLETED"];

const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    COOKING: "bg-violet-100 text-violet-700",
    READY_FOR_PICKUP: "bg-cyan-100 text-cyan-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
};

export function OrdersPage() {
    const orders = useRestaurantStore((state) => state.orders);
    const updateOrderStatus = useRestaurantStore((state) => state.updateOrderStatus);
    const refreshOrders = useRestaurantStore((state) => state.refreshOrders);
    const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);

    const grouped = useMemo(() => {
        return statusFlow.map((status) => ({
            status,
            count: orders.filter((order) => order.status === status).length,
        }));
    }, [orders]);

    const advanceStatus = async (order: RestaurantOrder) => {
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex === statusFlow.length - 1) return;
        const nextStatus = statusFlow[currentIndex + 1];
        await updateOrderStatus(order.id, nextStatus);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Orders</p>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Live orders board</h1>
                    <p className="text-sm text-slate-500">Track every order from PENDING to COMPLETED.</p>
                </div>
                <Button variant="outline" onClick={refreshOrders}>
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
                {grouped.map((group) => (
                    <div key={group.status} className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-900 dark:bg-slate-950">
                        <p className="text-xs uppercase text-slate-400">{group.status.replace("_", " ")}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{group.count}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow className="text-xs uppercase tracking-wide text-slate-400">
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Delivery</TableHead>
                            <TableHead>Placed</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="text-sm">
                                <TableCell className="font-semibold">{order.id}</TableCell>
                                <TableCell>
                                    <p className="font-medium text-slate-900 dark:text-white">{order.customerName}</p>
                                    <p className="text-xs text-slate-500">{order.deliveryAddress ?? "Pickup"}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-500">
                                        {order.items.map((item) => (
                                            <p key={item.name}>
                                                {item.quantity} x {item.name}
                                            </p>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>৳{order.totalPrice}</TableCell>
                                <TableCell>
                                    <Badge className={order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}>
                                        {order.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                                </TableCell>
                                <TableCell>{order.deliveryType}</TableCell>
                                <TableCell>
                                    {new Date(order.placedTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                        View
                                    </Button>
                                    {order.status !== "COMPLETED" && (
                                        <Button variant="secondary" size="sm" onClick={() => advanceStatus(order)}>
                                            Move to {statusFlow[statusFlow.indexOf(order.status) + 1].replace("_", " ")}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-3xl">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order {selectedOrder.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Items</p>
                                    <ul className="mt-2 text-sm text-slate-600">
                                        {selectedOrder.items.map((item) => (
                                            <li key={item.name}>
                                                {item.quantity} x {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                    {selectedOrder.customerNotes && (
                                        <p className="mt-2 text-xs text-slate-500">Notes: {selectedOrder.customerNotes}</p>
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900/60">
                                        <p className="font-semibold text-slate-900 dark:text-white">Customer</p>
                                        <p>{selectedOrder.customerName}</p>
                                        <p className="text-xs text-slate-500">{selectedOrder.deliveryAddress ?? "Pickup"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900/60">
                                        <p className="font-semibold text-slate-900 dark:text-white">Rider</p>
                                        <p>{selectedOrder.riderName ?? "Not assigned"}</p>
                                        <p className="text-xs text-slate-500">{selectedOrder.riderPhone ?? "-"}</p>
                                    </div>
                                </div>
                                {selectedOrder.riderLocation && (
                                    <div className="overflow-hidden rounded-2xl">
                                        <Map
                                            center={[selectedOrder.riderLocation.lat, selectedOrder.riderLocation.lng]}
                                            zoom={15}
                                            markers={[
                                                {
                                                    lat: selectedOrder.riderLocation.lat,
                                                    lng: selectedOrder.riderLocation.lng,
                                                    popup: selectedOrder.riderName,
                                                },
                                            ]}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
