import { useState } from "react";
import { Card } from "../../admin/components/ui/card";
import { Button } from "../../admin/components/ui/button";
import { Input } from "../../admin/components/ui/input";
import { useRestaurantStore } from "../store/restaurantStore";
import { profileSchema, type ProfileFormValues } from "../types/schemas";

export function ProfilePage() {
    const profile = useRestaurantStore((state) => state.profile);
    const updateProfile = useRestaurantStore((state) => state.updateProfile);
    const [values, setValues] = useState<ProfileFormValues>({
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        category: profile.category,
        openingHours: profile.openingHours,
        closingHours: profile.closingHours,
        licenseNumber: profile.licenseNumber,
        logoUrl: profile.logoUrl ?? "",
        coverPhotoUrl: profile.coverPhotoUrl ?? "",
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: keyof ProfileFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const parsed = profileSchema.parse(values);
            setSubmitting(true);
            await updateProfile(parsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid data");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Profile</p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Restaurant identity</h1>
                <p className="text-sm text-slate-500">Keep RideN'Bite diners updated with precise business information.</p>
            </div>

            <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm text-slate-500">Restaurant name</label>
                            <Input value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Category</label>
                            <Input value={values.category} onChange={(e) => handleChange("category", e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-slate-500">Address</label>
                        <textarea
                            className="min-h-[80px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                            value={values.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm text-slate-500">Phone</label>
                            <Input value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Food license number</label>
                            <Input value={values.licenseNumber} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm text-slate-500">Opening hour</label>
                            <Input type="time" value={values.openingHours} onChange={(e) => handleChange("openingHours", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Closing hour</label>
                            <Input type="time" value={values.closingHours} onChange={(e) => handleChange("closingHours", e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm text-slate-500">Logo URL</label>
                            <Input value={values.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Cover photo URL</label>
                            <Input value={values.coverPhotoUrl} onChange={(e) => handleChange("coverPhotoUrl", e.target.value)} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                    <Button type="submit" className="rounded-full px-6" disabled={submitting}>
                        {submitting ? "Saving" : "Save profile"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
