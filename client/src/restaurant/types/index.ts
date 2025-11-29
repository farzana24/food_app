export type MenuCategory =
    | "BIRYANI"
    | "BURGER"
    | "DESSERT"
    | "DRINK"
    | "PASTA"
    | "PIZZA"
    | "RICE_BOWL"
    | "SALAD"
    | "SEAFOOD"
    | "SPECIAL";

export type SpiceLevel = "MILD" | "MEDIUM" | "HOT";

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: MenuCategory;
    price: number;
    cookingTime: number;
    spiceLevel: SpiceLevel;
    rating: number;
    isAvailable: boolean;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus = "PENDING" | "ACCEPTED" | "COOKING" | "READY_FOR_PICKUP" | "COMPLETED";

export type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

export type DeliveryType = "PICKUP" | "DELIVERY";

export interface OrderItemSummary {
    name: string;
    quantity: number;
}

export interface RestaurantOrder {
    id: string;
    customerName: string;
    items: OrderItemSummary[];
    totalPrice: number;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    deliveryType: DeliveryType;
    placedTime: string;
    customerNotes?: string;
    deliveryAddress?: string;
    riderName?: string;
    riderPhone?: string;
    riderLocation?: {
        lat: number;
        lng: number;
    };
}

export interface DashboardStats {
    totalOrdersToday: number;
    activeOrders: number;
    earningsToday: number;
    pendingMenuItems: number;
}

export interface ChartPoint {
    label: string;
    value: number;
    secondaryValue?: number;
}

export interface WeeklyEarningsSeries {
    week: string;
    earnings: number;
}

export interface DishPerformance {
    name: string;
    orders: number;
}

export interface OrderFrequencyPoint {
    hour: string;
    orders: number;
}

export interface EarningsSummary {
    totalEarnings: number;
    platformFee: number;
    payoutBalance: number;
    pendingPayouts: number;
}

export interface EarningsRow {
    id: string;
    amount: number;
    commission: number;
    netEarned: number;
    date: string;
}

export interface RestaurantProfile {
    id: string;
    name: string;
    address: string;
    phone: string;
    category: string;
    openingHours: string;
    closingHours: string;
    licenseNumber: string;
    logoUrl?: string;
    coverPhotoUrl?: string;
}

export interface AnalyticsSnapshot {
    topSellingDish: string;
    salesByCategory: ChartPoint[];
    peakOrderingHours: ChartPoint[];
    monthlyOverview: ChartPoint[];
    repeatCustomerRate: number;
    deliveryTimePerformance: number;
}

export interface NotificationSetting {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
}

export interface GeneralSettings {
    notification: NotificationSetting;
    autoAcceptOrders: boolean;
    maxCookingLoad: number;
}

export interface SecuritySettings {
    hasTwoFactorAuth: boolean;
    sessions: Array<{
        id: string;
        device: string;
        location: string;
        lastActive: string;
    }>;
}

export interface AlertPayload {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    type: "NEW_ORDER" | "MENU" | "SYSTEM";
    meta?: Record<string, unknown>;
}
