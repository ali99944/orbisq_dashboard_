import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import CategoriesPage from "./pages/categories/categories";
import AddCategoryPage from "./pages/categories/create-category";
import CouponsPage from "./pages/coupons/coupons";
import AddCouponPage from "./pages/coupons/create-coupon";
// import DiscountsPage from "./pages/discounts/discounts";
// import AddDiscountPage from "./pages/discounts/create-discount";
// import TaxesPage from "./pages/taxes/taxes";
// import BranchesPage from "./pages/branches/branches";
// import SuppliersPage from "./pages/suppliers/suppliers";
// import AddSupplierPage from "./pages/suppliers/create-supplier";
import ProductsPage from "./pages/products/products";
import AddProductPage from "./pages/products/create-product";
import ProductDetailsPage from "./pages/products/product-details";
// import InventoryItemsPage from "./pages/inventory-items/inventory-items";
// import AddInventoryItemPage from "./pages/inventory-items/create-inventory-item";
// import WarehousesPage from "./pages/warehouses/warehouses";
// import AddWarehousePage from "./pages/warehouses/create-warehouse";
import DashboardHomePage from "./pages/dashboard/dashboard";
import DesksPage from "./pages/desks/desks";
// import ReasonsPage from "./pages/reasons/reasons";
// import ReasonCategoriesPage from "./pages/reasons/reason-categories";
// import RolesPage from "./pages/roles/roles";
// import RoleFormPage from "./pages/roles/role-form";
// import EmployeesPage from "./pages/employees/employees";
// import AddEmployeePage from "./pages/employees/create-employee";
// import EmployeeDetailsPage from "./pages/employees/epmployee-details";
// import PermissionsPage from "./pages/permissions/permissions";
// import PermissionGroupsPage from "./pages/permissions/permission-groups";
// import ShopSettingsPage from "./pages/settings/settings";
// import ReportsPage from "./pages/reports/reports";
import Login from "./pages/auth/login_screen";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
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
                path: '/coupons/create',
                element: <AddCouponPage />
            },
            // {
            //     path: '/discounts',
            //     element: <DiscountsPage />
            // },
            // {
            //     path: '/taxes',
            //     element: <TaxesPage />
            // },
            // {
            //     path: '/discounts/create',
            //     element: <AddDiscountPage />
            // },
            // {
            //     path: '/branches',
            //     element: <BranchesPage />
            // },
            // {
            //     path: '/branches/create',
            //     element: <AddBranchPage />
            // },
            // {
            //     path: '/suppliers',
            //     element: <SuppliersPage />
            // },
            // {
            //     path: '/suppliers/create',
            //     element: <AddSupplierPage />
            // },
            // {
            //     path: '/inventory-items',
            //     element: <InventoryItemsPage />
            // },
            // {
            //     path: '/inventory-items/create',
            //     element: <AddInventoryItemPage />
            // },
            // {
            //     path: '/warehouses',
            //     element: <WarehousesPage />
            // },
            // {
            //     path: '/warehouses/create',
            //     element: <AddWarehousePage />
            // },
            {
                path: '/products',
                element: <ProductsPage />
            },
            {
                path: '/products/:id',
                element: <ProductDetailsPage />
            },
            {
                path: '/products/create',
                element: <AddProductPage />
            },
            {
                path: '/desks',
                element: <DesksPage />
            },
            // {
            //     path: '/reasons',
            //     element: <ReasonsPage />
            // },
            // {
            //     path: '/reason-categories',
            //     element: <ReasonCategoriesPage />
            // },
            // {
            //     path: '/roles',
            //     element: <RolesPage />
            // },
            // {
            //     path: '/roles/create',
            //     element: <RoleFormPage />
            // },
            // {
            //     path: '/employees',
            //     element: <EmployeesPage />
            // },
            // {
            //     path: '/employees/:id',
            //     element: <EmployeeDetailsPage />
            // },
            // {
            //     path: '/permissions',
            //     element: <PermissionsPage />
            // },
            // {
            //     path: '/permission-groups',
            //     element: <PermissionGroupsPage />
            // },
            // {
            //     path: '/employees/create',
            //     element: <AddEmployeePage />
            // },
            // {
            //     path: '/settings',
            //     element: <ShopSettingsPage />
            // },
            // {
            //     path: '/reports',
            //     element: <ReportsPage />
            // },
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]);

export default router