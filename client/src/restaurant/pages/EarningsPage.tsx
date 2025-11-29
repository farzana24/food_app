import { useState } from "react";
import { Card } from "../../admin/components/ui/card";
import { Button } from "../../admin/components/ui/button";
import { Input } from "../../admin/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../admin/components/ui/table";
import { useRestaurantStore } from "../store/restaurantStore";
import { payoutRequestSchema, type PayoutRequestValues } from "../types/schemas";

export function EarningsPage() {
    const earnings = useRestaurantStore((state) => state.earnings);
    const rows = useRestaurantStore((state) => state.earningsRows);
    const requestPayout = useRestaurantStore((state) => state.requestPayout);
    const [values, setValues] = useState<PayoutRequestValues>({
        amount: 1000,
        method: "BANK",
        accountName: "",
        accountNumber: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: keyof PayoutRequestValues, value: string | number) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const parsed = payoutRequestSchema.parse({
                ...values,
                amount: Number(values.amount),
            });
            setSubmitting(true);
            await requestPayout(parsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid data");
        } finally {
            setSubmitting(false);
        }
    };

    const summaryCards = [
        { label: "Total earnings", value: earnings.totalEarnings },
        { label: "Platform fee", value: earnings.platformFee },
        { label: "Payout balance", value: earnings.payoutBalance },
        { label: "Pending payouts", value: earnings.pendingPayouts },
    ];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Finance</p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Earnings & payouts</h1>
                <p className="text-sm text-slate-500">Transparent revenue, commissions, and payout control.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <Card key={card.label} className="rounded-3xl border border-slate-100 p-5 dark:border-slate-900">
                        <p className="text-xs uppercase text-slate-400">{card.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">৳{card.value.toLocaleString()}</p>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Commission</TableHead>
                                <TableHead>Net earned</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-semibold">{row.id}</TableCell>
                                    <TableCell>৳{row.amount}</TableCell>
                                    <TableCell>৳{row.commission}</TableCell>
                                    <TableCell>৳{row.netEarned}</TableCell>
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Card className="rounded-3xl border border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Withdraw funds</p>
                    <p className="text-xs text-slate-500">Transfer available balance to your bank or mobile wallet.</p>
                    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm text-slate-500">Amount (৳)</label>
                            <Input
                                type="number"
                                value={values.amount}
                                min={500}
                                onChange={(e) => handleChange("amount", Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Method</label>
                            <select
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                value={values.method}
                                onChange={(e) => handleChange("method", e.target.value)}
                            >
                                <option value="BANK">Bank transfer</option>
                                <option value="MOBILE_BANKING">Mobile banking</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Account name</label>
                            <Input value={values.accountName} onChange={(e) => handleChange("accountName", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Account / mobile number</label>
                            <Input value={values.accountNumber} onChange={(e) => handleChange("accountNumber", e.target.value)} />
                        </div>
                        {error && <p className="text-sm text-rose-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Sending request..." : "Request payout"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
