// src/components/sidebar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, // Dashboard
    UtensilsCrossed, // Products
    Tags, // Categories
    ClipboardList, // Orders
    Table, // Tables
    Percent, // Discounts
    ChevronDown, // Collapse icon
    Tag, // Coupons
    Settings, // Settings
    Users, // Users
    Truck, // Delivery
    Bell, // Notifications
    History, // Changelog
    SlidersHorizontal, // Modifier Groups
} from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

interface SidebarProps {
    isSidebarOpen: boolean;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    disabled?: boolean;
    condition?: boolean;
    badge?: string;
}

interface NavGroup {
    key: string;
    label: string;
    icon: React.ElementType;
    items: NavItem[];
    condition?: boolean;
}

// Animation variants for smoother transitions
const sidebarVariants = {
    open: { x: 0, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    closed: { x: 0, boxShadow: 'none' },
};

const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -5 },
};

const groupContentVariants = {
    open: { 
        opacity: 1, 
        height: 'auto',
        transition: { 
            duration: 0.3,
            staggerChildren: 0.05,
            when: "beforeChildren"
        }
    },
    collapsed: { 
        opacity: 1, 
        height: 0,
        transition: { 
            duration: 0.2,
            staggerChildren: 0.05,
            staggerDirection: -1,
            when: "afterChildren"
        }
    }
};

// --- Collapsible Group Component ---
const NavGroupItem: React.FC<{ group: NavGroup; currentPath: string }> = ({ group, currentPath }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Determine if any child link is active
    const isGroupActive = group.items.some(item =>
        currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + '/'))
    );

    // Open the group by default if a child is active on page load
    useEffect(() => {
        if (isGroupActive) {
            setIsOpen(true);
        }
    }, [isGroupActive]);

    const toggleOpen = () => setIsOpen(!isOpen);

    // Filter items based on their condition
    const visibleItems = group.items.filter(item => item.condition !== false);
    if (visibleItems.length === 0) return null;

    // Style constants
    const primaryColor = "#A70000";
    const hoverBgColor = "#FDECEC";

    return (
        <div className="mb-1">
            {/* Group Trigger Button */}
            <button
                onClick={toggleOpen}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isGroupActive ? `text-[${primaryColor}] font-semibold` : 'text-gray-600 hover:text-[#8B0000] hover:bg-[#FDECEC]'}`}
                style={isGroupActive && !isOpen ? { backgroundColor: hoverBgColor } : {}}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3">
                    <group.icon 
                        className={`h-5 w-5 ml-2.5 flex-shrink-0 transition-colors duration-200 ${isGroupActive ? `text-[${primaryColor}]` : 'text-gray-400 group-hover:text-[#8B0000]'}`} 
                        style={isGroupActive ? { color: primaryColor } : {}}
                    />
                    {group.label}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={groupContentVariants}
                        className="overflow-hidden pr-3 mt-1 space-y-1"
                    >
                        <div className="border-r-2 border-gray-100 mr-4 pr-2 py-1">
                            {visibleItems.map((item) => {
                                const isChildActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + '/'));
                                return (
                                    <motion.div
                                        key={item.href}
                                        variants={itemVariants}
                                    >
                                        <Link
                                            to={item.disabled ? '#' : item.href}
                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isChildActive ? `text-white bg-[${primaryColor}] shadow-sm` : 'text-gray-600 hover:text-[#8B0000] hover:bg-[#FDECEC]'} ${item.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600' : ''}`}
                                            aria-disabled={item.disabled}
                                            onClick={(e) => item.disabled && e.preventDefault()}
                                        >
                                            <div className="flex items-center">
                                                <span className="w-4 ml-3"></span>
                                                {item.label}
                                            </div>
                                            {item.badge && (
                                                <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.disabled && (
                                                <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                                                    قريباً
                                                </span>
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Sidebar Component ---
const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const shop = useAppSelector(state => state.auth_store.portal?.shop);
    const primaryColor = "#A70000";

    // --- Navigation Structure with Groups ---
    const navStructure: NavGroup[] = [
        { // Dashboard
            key: 'dashboard', 
            label: 'لوحة التحكم', 
            icon: LayoutGrid, 
            condition: true,
            items: [ 
                { href: '/', label: 'لوحة التحكم', icon: LayoutGrid, condition: true } 
            ]
        },
        { // Menu Management
            key: 'menu', 
            label: 'إدارة القائمة', 
            icon: UtensilsCrossed, 
            condition: true,
            items: [
                { href: '/products', label: 'المنتجات', icon: UtensilsCrossed, condition: true },
                { href: '/categories', label: 'التصنيفات', icon: Tags, condition: true },
                { href: '/modifier-groups', label: 'مجموعات التعديل', icon: SlidersHorizontal, condition: true },
                { href: '/desks', label: "الطاولات", icon: Table, condition: shop?.business_info?.has_dine_in },
            ]
        },
        { // Operations
            key: 'operations', 
            label: 'العمليات', 
            icon: ClipboardList, 
            condition: true,
            items: [
                { href: '/orders', label: 'الطلبات', icon: ClipboardList, condition: true, badge: 'جديد' },
                { href: '/delivery', label: 'التوصيل', icon: Truck, condition: true },
            ]
        },
        { // Marketing
            key: 'marketing', 
            label: 'التسويق', 
            icon: Percent, 
            condition: true,
            items: [
                { href: '/coupons', label: 'الكوبونات', icon: Tag, condition: true },
            ]
        },
        { // Settings
            key: 'settings', 
            label: 'الإعدادات', 
            icon: Settings, 
            condition: true,
            items: [
                { href: '/settings/profile', label: 'الملف الشخصي', icon: Users, condition: true, disabled: true },
                { href: '/settings/shop', label: 'إعدادات المتجر', icon: Settings, condition: true, disabled: true },
                { href: '/settings/notifications', label: 'الإشعارات', icon: Bell, condition: true, disabled: true },
                { href: '/changelog', label: 'سجل التحديثات', icon: History, condition: true }
            ]
        },
    ];

    return (
        <motion.aside
            initial={isSidebarOpen ? "open" : "closed"}
            animate={isSidebarOpen ? "open" : "closed"}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-white border-l border-gray-200 flex flex-col fixed inset-y-0 right-0 z-30 w-64 transform ${!isSidebarOpen ? 'translate-x-full' : ''} lg:translate-x-0`}
            dir="rtl"
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0 px-4">
                <Link to="/" className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#A70000] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">OQ</span>
                    </div>
                    <h1 className="text-xl font-bold" style={{ color: primaryColor }}>Orbis Q</h1>
                </Link>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="flex-grow overflow-y-auto py-4 px-3 custom-scrollbar">
                <ul className="space-y-2">
                    {navStructure
                        .filter(group => group.condition !== false)
                        .map((group) => (
                        <li key={group.key}>
                            {/* Render Dashboard link directly */}
                            {group.key === 'dashboard' ? (
                                <Link
                                    to={group.items[0].href}
                                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentPath === '/' ? `text-white bg-[${primaryColor}] shadow-sm` : `text-gray-600 hover:text-[#8B0000] hover:bg-[#FDECEC]`}`}
                                >
                                    <group.icon className={`ml-2.5 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${currentPath === '/' ? 'text-white' : 'text-gray-400 group-hover:text-[#8B0000]'}`} />
                                    {group.label}
                                </Link>
                            ) : (
                                /* Render other groups as collapsible items */
                                <NavGroupItem group={group} currentPath={currentPath} />
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer Area */}
            <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Orbis Q</p>
                <p className="mt-1">v1.0.0</p>
            </div>
        </motion.aside>
    );
};

export default Sidebar;