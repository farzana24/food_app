import type {
    AlertPayload,
    AnalyticsSnapshot,
    DashboardStats,
    EarningsRow,
    EarningsSummary,
    MenuItem,
    RestaurantOrder,
    RestaurantProfile,
    WeeklyEarningsSeries,
    DishPerformance,
    OrderFrequencyPoint,
} from "../types";

export const fallbackProfile: RestaurantProfile = {
    id: "resto-001",
    name: "RideN'Bite Kitchen",
    address: "27 Gulshan Avenue, Dhaka",
    phone: "+8801700000000",
    category: "Fast Casual",
    openingHours: "10:00",
    closingHours: "23:30",
    licenseNumber: "RB-928331",
    logoUrl: "https://placehold.co/96x96",
    coverPhotoUrl: "https://placehold.co/1200x320",
};

export const fallbackStats: DashboardStats = {
    totalOrdersToday: 86,
    activeOrders: 12,
    earningsToday: 24500,
    pendingMenuItems: 4,
};

export const fallbackMenu: MenuItem[] = [
    {
        id: "dish-001",
        name: "Dhaka Dynamite Burger",
        description: "Smash patty, naga aioli, pickled onions, brioche bun",
        category: "BURGER",
        price: 450,
        cookingTime: 12,
        spiceLevel: "MEDIUM",
        rating: 4.8,
        isAvailable: true,
        imageUrl: "https://placehold.co/64",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "dish-002",
        name: "Grilled Prawn Platter",
        description: "Charcoal grilled Bay-of-Bengal prawns with herb rice",
        category: "SEAFOOD",
        price: 820,
        cookingTime: 20,
        spiceLevel: "HOT",
        rating: 4.6,
        isAvailable: true,
        imageUrl: "https://placehold.co/64",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const fallbackOrders: RestaurantOrder[] = [
    {
        id: "ORD-92833",
        customerName: "Nabila Hasan",
        items: [
            { name: "Dhaka Dynamite Burger", quantity: 2 },
            { name: "Sweet Chili Fries", quantity: 1 },
        ],
        totalPrice: 1350,
        paymentStatus: "PAID",
        status: "COOKING",
        deliveryType: "DELIVERY",
        placedTime: new Date().toISOString(),
        customerNotes: "Extra cheese on both burgers",
        deliveryAddress: "House 11, Road 125, Gulshan",
        riderName: "Mahfuz Rahman",
        riderPhone: "+880171111111",
        riderLocation: { lat: 23.7805733, lng: 90.2792399 },
    },
    {
        id: "ORD-92888",
        customerName: "Shafin Khan",
        items: [{ name: "Grilled Prawn Platter", quantity: 1 }],
        totalPrice: 890,
        paymentStatus: "PAID",
        status: "READY_FOR_PICKUP",
        deliveryType: "PICKUP",
        placedTime: new Date().toISOString(),
        customerNotes: "Less oil",
    },
];

export const fallbackEarningsSummary: EarningsSummary = {
    totalEarnings: 1824500,
    platformFee: 182300,
    payoutBalance: 82000,
    pendingPayouts: 45000,
};

export const fallbackEarningsRows: EarningsRow[] = fallbackOrders.map((order) => ({
    id: order.id,
    amount: order.totalPrice,
    commission: Math.round(order.totalPrice * 0.15),
    netEarned: Math.round(order.totalPrice * 0.85),
    date: order.placedTime,
}));

export const fallbackWeeklyEarnings: WeeklyEarningsSeries[] = [
    { week: "Mon", earnings: 18000 },
    { week: "Tue", earnings: 21000 },
    { week: "Wed", earnings: 26000 },
    { week: "Thu", earnings: 29000 },
    { week: "Fri", earnings: 41000 },
    { week: "Sat", earnings: 48000 },
    { week: "Sun", earnings: 32000 },
];

export const fallbackPopularDishes: DishPerformance[] = [
    { name: "Dhaka Dynamite Burger", orders: 145 },
    { name: "Grilled Prawn Platter", orders: 98 },
    { name: "Naga Chicken Wings", orders: 87 },
    { name: "Smoked Beef Pizza", orders: 74 },
];

export const fallbackOrderFrequency: OrderFrequencyPoint[] = [
    { hour: "10:00", orders: 6 },
    { hour: "12:00", orders: 18 },
    { hour: "14:00", orders: 14 },
    { hour: "16:00", orders: 9 },
    { hour: "18:00", orders: 23 },
    { hour: "20:00", orders: 27 },
    { hour: "22:00", orders: 11 },
];

export const fallbackAnalytics: AnalyticsSnapshot = {
    topSellingDish: "Dhaka Dynamite Burger",
    salesByCategory: [
        { label: "Burger", value: 38 },
        { label: "Rice Bowl", value: 22 },
        { label: "Seafood", value: 18 },
        { label: "Dessert", value: 12 },
    ],
    peakOrderingHours: fallbackOrderFrequency,
    monthlyOverview: [
        { label: "Aug", value: 420000 },
        { label: "Sep", value: 480000 },
        { label: "Oct", value: 510000 },
        { label: "Nov", value: 560000 },
    ],
    repeatCustomerRate: 62,
    deliveryTimePerformance: 82,
};

export const fallbackAlerts: AlertPayload[] = [
    {
        id: "alert-1",
        title: "New order",
        message: "Order ORD-92833 just arrived",
        createdAt: new Date().toISOString(),
        type: "NEW_ORDER",
    },
];
