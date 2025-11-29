import { useState } from "react";
import { Input } from "../../admin/components/ui/input";
import { Button } from "../../admin/components/ui/button";
import type { MenuItem } from "../types";
import { menuItemSchema, type MenuFormValues } from "../types/schemas";

const categories = [
    "BIRYANI",
    "BURGER",
    "DESSERT",
    "DRINK",
    "PASTA",
    "PIZZA",
    "RICE_BOWL",
    "SALAD",
    "SEAFOOD",
    "SPECIAL",
] as const;

interface MenuFormProps {
    defaultValues?: Partial<MenuItem>;
    onSubmit: (values: MenuFormValues) => Promise<void>;
    onClose: () => void;
}

export function MenuForm({ defaultValues, onSubmit, onClose }: MenuFormProps) {
    const [values, setValues] = useState<MenuFormValues>({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        category: (defaultValues?.category as MenuFormValues["category"]) ?? "SPECIAL",
        price: defaultValues?.price ?? 0,
        cookingTime: defaultValues?.cookingTime ?? 10,
        spiceLevel: (defaultValues?.spiceLevel as MenuFormValues["spiceLevel"]) ?? "MEDIUM",
        imageUrl: defaultValues?.imageUrl ?? "",
        isAvailable: defaultValues?.isAvailable ?? true,
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: keyof MenuFormValues, value: string | number | boolean) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const parsed = menuItemSchema.parse({
                ...values,
                price: Number(values.price),
                cookingTime: Number(values.cookingTime),
            });
            setSubmitting(true);
            await onSubmit(parsed);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid data");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="text-sm text-slate-500">Dish name</label>
                <Input value={values.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                    className="min-h-[80px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    value={values.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm text-slate-500">Category</label>
                    <select
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                        value={values.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-slate-500">Spice level</label>
                    <select
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                        value={values.spiceLevel}
                        onChange={(e) => handleChange("spiceLevel", e.target.value)}
                    >
                        <option value="MILD">Mild</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HOT">Hot</option>
                    </select>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm text-slate-500">Price (৳)</label>
                    <Input
                        type="number"
                        value={values.price}
                        onChange={(e) => handleChange("price", Number(e.target.value))}
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-500">Cooking time (minutes)</label>
                    <Input
                        type="number"
                        value={values.cookingTime}
                        onChange={(e) => handleChange("cookingTime", Number(e.target.value))}
                        min={1}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="text-sm text-slate-500">Image URL</label>
                <Input value={values.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/60">
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Availability</p>
                    <p className="text-xs text-slate-500">Control if the dish is visible to diners</p>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={values.isAvailable}
                        onChange={(e) => handleChange("isAvailable", e.target.checked)}
                    />
                    <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500">
                        <span className="ml-1 mt-1 block h-4 w-4 rounded-full bg-white transition peer-checked:ml-6" />
                    </span>
                </label>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Saving..." : "Save dish"}
            </Button>
        </form>
    );
}
