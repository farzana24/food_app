import { Routes, Route, Navigate } from "react-router-dom";
import { RestaurantLayout } from "./layout/RestaurantLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { MenuPage } from "./pages/MenuPage";
import { OrdersPage } from "./pages/OrdersPage";
import { EarningsPage } from "./pages/EarningsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

export function RestaurantApp() {
    return (
        <RestaurantLayout>
            <Routes>
                <Route index element={<OverviewPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/earnings" element={<EarningsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/restaurant" replace />} />
            </Routes>
        </RestaurantLayout>
    );
}
