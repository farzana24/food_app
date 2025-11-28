import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../utils/helpers";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    trend?: "up" | "down";
    description?: string;
}

export function KPICard({
    title,
    value,
    change,
    icon,
    trend,
    description,
}: KPICardProps) {
    const isPositive = trend === "up" || (change !== undefined && change > 0);
    const isNegative = trend === "down" || (change !== undefined && change < 0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="h-4 w-4 text-slate-500">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(change !== undefined || description) && (
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                        {change !== undefined && (
                            <div
                                className={cn(
                                    "flex items-center",
                                    isPositive && "text-green-600",
                                    isNegative && "text-red-600"
                                )}
                            >
                                {isPositive && <ArrowUp className="mr-1 h-3 w-3" />}
                                {isNegative && <ArrowDown className="mr-1 h-3 w-3" />}
                                <span>{Math.abs(change)}%</span>
                            </div>
                        )}
                        {description && <span>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
