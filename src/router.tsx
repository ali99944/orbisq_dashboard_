import { createBrowserRouter } from "react-router-dom";
import SupportPage from "./pages/support/support";
import ChangelogPage from "./pages/changelog/changelog";
import ChangePasswordPage from "./pages/auth/change-password";
import Layout from "./components/layout";
import CategoriesPage from "./pages/categories/categories";
import AddCategoryPage from "./pages/categories/create-category";
import CouponsPage from "./pages/coupons/coupons";
import ProductsPage from "./pages/products/products";
import AddProductPage from "./pages/products/create-product";
import DashboardHomePage from "./pages/dashboard/dashboard";
import DesksPage from "./pages/desks/desks";
import OrdersPage from "./pages/orders/orders";
import OrderDetailsPage from "./pages/orders/order-details";
import Login from "./pages/auth/login_screen";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
        {
          path: "support",
          element: <SupportPage />
        },
        {
          path: "change-password",
          element: <ChangePasswordPage />
        },
            {
                path: '/',
                element: <DashboardHomePage />
            },
            {
                path: '/categories',
                element: <CategoriesPage />
            },
            {
                path: '/categories/create',
                element: <AddCategoryPage />
            },
            {
                path: '/coupons',
                element: <CouponsPage />
            },
            {
                path: '/products',
                element: <ProductsPage />
            },
            {
                path: '/products',
                element: <ProductsPage />
            },
            {
                path: '/products/create',
                element: <AddProductPage />
            },
            {
                path: '/desks',
                element: <DesksPage />
            },
            {
                path: '/orders',
                element: <OrdersPage />
            },
            {
                path: '/orders/:id',
                element: <OrderDetailsPage />
            },
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/changelog',
        element: <ChangelogPage />
    }
]);

export default router