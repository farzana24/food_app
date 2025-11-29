import { useMemo, useState } from "react";
import { Button } from "../../admin/components/ui/button";
import { Badge } from "../../admin/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../admin/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../admin/components/ui/dialog";
import { MenuForm } from "../components/MenuForm";
import { useRestaurantStore } from "../store/restaurantStore";
import { useMenuBulkSelection } from "../hooks/useMenuBulkSelection";
import type { MenuItem } from "../types";
import { toast } from "../../admin/components/ui/use-toast";

export function MenuPage() {
    const menu = useRestaurantStore((state) => state.menu);
    const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
    const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);
    const deleteMenuItems = useRestaurantStore((state) => state.deleteMenuItems);
    const { selectedIds, toggle, reset, bulkSet, isSelected } = useMenuBulkSelection();
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [bulkCategory, setBulkCategory] = useState<MenuItem["category"]>("SPECIAL");

    const allIds = useMemo(() => menu.map((item) => item.id), [menu]);

    const handleBulkAvailability = async (available: boolean) => {
        await Promise.all(
            Array.from(selectedIds).map((id) => updateMenuItem(id, { isAvailable: available }))
        );
        toast({ title: "Availability synced", description: `${selectedIds.size} dishes updated` });
        reset();
    };

    const handleBulkDelete = async () => {
        await deleteMenuItems(Array.from(selectedIds));
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Menu</p>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Menu management</h1>
                    <p className="text-sm text-slate-500">Control availability, pricing, and new launches.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full px-6">Add new dish</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>New dish</DialogTitle>
                        </DialogHeader>
                        <MenuForm
                            onSubmit={addMenuItem}
                            onClose={() => {
                                setCreateOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/5 dark:text-amber-200">
                    <p>{selectedIds.size} selected</p>
                    <Button size="sm" variant="ghost" onClick={() => handleBulkAvailability(true)}>
                        Mark available
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleBulkAvailability(false)}>
                        Mark unavailable
                    </Button>
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-xl border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase text-amber-600"
                            value={bulkCategory}
                            onChange={(e) => setBulkCategory(e.target.value as MenuItem["category"])}
                        >
                            {["BIRYANI", "BURGER", "DESSERT", "DRINK", "PASTA", "PIZZA", "RICE_BOWL", "SALAD", "SEAFOOD", "SPECIAL"].map((category) => (
                                <option key={category} value={category}>
                                    {category.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                                await Promise.all(
                                    Array.from(selectedIds).map((id) => updateMenuItem(id, { category: bulkCategory }))
                                );
                                toast({ title: "Category updated", description: `${selectedIds.size} dishes recategorised` });
                                reset();
                            }}
                        >
                            Apply category
                        </Button>
                    </div>
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                        Delete
                    </Button>
                    <Button size="sm" variant="outline" onClick={reset}>
                        Clear
                    </Button>
                </div>
            )}

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow className="text-xs uppercase tracking-wide text-slate-400">
                            <TableHead className="w-10">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300"
                                    checked={selectedIds.size === menu.length && menu.length > 0}
                                    onChange={(e) => bulkSet(allIds, e.target.checked)}
                                />
                            </TableHead>
                            <TableHead>Dish</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menu.map((item) => (
                            <TableRow key={item.id} className="text-sm">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300"
                                        checked={isSelected(item.id)}
                                        onChange={() => toggle(item.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-12 w-12 rounded-2xl object-cover"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.description}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.category.replace("_", " ")}</TableCell>
                                <TableCell>৳{item.price}</TableCell>
                                <TableCell>{item.rating.toFixed(1)}</TableCell>
                                <TableCell>
                                    <Badge className={item.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}>
                                        {item.isAvailable ? "Available" : "Hidden"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                                    >
                                        {item.isAvailable ? "Hide" : "Show"}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => deleteMenuItems([item.id])}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit dish</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <MenuForm
                            key={editItem.id}
                            defaultValues={editItem}
                            onSubmit={(values) => updateMenuItem(editItem.id, values)}
                            onClose={() => setEditItem(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
