// src/components/layout/Sidebar.tsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import {
    LayoutGrid, // Dashboard
    UtensilsCrossed, // Dishes
    Tags, // Categories
    ClipboardList, // Orders
    Table, // Tables
    Percent, // Coupons / Discounts
    ChevronDown, // Collapse icon
    Tag,
} from 'lucide-react';
import { useAppSelector } from '../hooks/redux'; // Adjust path

interface SidebarProps {
    isSidebarOpen: boolean;
    // toggleSidebar: () => void; // We might need this back if closing on nav click mobile
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    disabled?: boolean;
    condition?: boolean; // Condition to show item itself
}

interface NavGroup {
    key: string; // Unique key for the group
    label: string;
    icon: React.ElementType;
    items: NavItem[];
    condition?: boolean; // Condition to show the whole group
}

// --- Collapsible Group Component ---
const NavGroupItem: React.FC<{ group: NavGroup; currentPath: string }> = ({ group, currentPath }) => {
    const [isOpen, setIsOpen] = useState(false); // State for this specific group

     // Determine if any child link is active
     const isGroupActive = group.items.some(item =>
        currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + '/'))
    );

     // Open the group by default if a child is active on page load
     React.useEffect(() => {
         if (isGroupActive) {
             setIsOpen(true);
         }
         // Optional: close if becomes inactive? Depends on desired UX
         // else { setIsOpen(false); }
     }, [isGroupActive]);


    const toggleOpen = () => setIsOpen(!isOpen);

    // Filter items based on their condition
    const visibleItems = group.items.filter(item => item.condition !== false);
    if (visibleItems.length === 0) return null; // Don't render group if no items are visible

    // Style constants (can be moved outside if preferred)
    const primaryColor = "#A70000";
    const hoverBgColor = "#FDECEC";
    const hoverTextColor = "#8B0000";
    const linkBaseStyle = "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group";
    const linkActiveStyle = `text-white bg-[${primaryColor}] shadow-sm`;
    const linkInactiveStyle = `text-gray-600 hover:text-[${hoverTextColor}] hover:bg-[${hoverBgColor}]`;
    const iconBaseStyle = "ml-3 h-4 w-4 flex-shrink-0 transition-colors duration-150"; // Smaller icons
    const iconInactiveStyle = `text-gray-400 group-hover:text-[${hoverTextColor}]`;

    return (
        <div>
            {/* Group Trigger Button */}
            <button
                onClick={toggleOpen}
                className={`${linkBaseStyle} ${isGroupActive ? `text-[${primaryColor}] font-semibold` : linkInactiveStyle} justify-between`}
                 style={isGroupActive && !isOpen ? { backgroundColor: hoverBgColor } : {}} // Subtle highlight if active but closed
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3">
                    <group.icon className={`${iconBaseStyle} ${isGroupActive ? `text-[${primaryColor}]` : iconInactiveStyle}`} style={isGroupActive ? { color: primaryColor } : {}}/>
                    {group.label}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden pr-4 mt-1 space-y-1 border-r-2 border-gray-100 mr-3" // Indentation and line
                    >
                        {visibleItems.map((item) => {
                             const isChildActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + '/'));
                             return (
                                <Link
                                    key={item.href}
                                    to={item.disabled ? '#' : item.href}
                                    className={`${linkBaseStyle} ${isChildActive ? linkActiveStyle : linkInactiveStyle} !py-2 !text-xs ${item.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600' : ''}`} // Smaller text for items
                                    aria-disabled={item.disabled}
                                    onClick={(e) => item.disabled && e.preventDefault()}
                                >
                                    {/* Optional: Use a different icon or just text */}
                                     <span className="w-4 ml-3"></span> {/* Placeholder for alignment */}
                                     {item.label}
                                     {item.disabled && <span className="text-[9px] mr-auto bg-gray-200 text-gray-500 px-1 py-0 rounded">قريباً</span>}
                                </Link>
                            );
                        })}
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
    const shop = useAppSelector(state => state.auth_store.portal?.shop); // Get settings
    const primaryColor = "#A70000";

    // --- Navigation Structure with Groups ---
    const navStructure: NavGroup[] = [
        { // Dashboard (Not collapsible)
            key: 'dashboard', label: 'لوحة التحكم', icon: LayoutGrid, condition: true,
            items: [ { href: '/', label: 'لوحة التحكم', icon: LayoutGrid, condition: true } ] // Rendered slightly differently below
        },
        { // Menu Management
            key: 'menu', label: 'إدارة القائمة', icon: UtensilsCrossed, condition: true,
            items: [
                { href: '/products', label: 'المنتجات', icon: UtensilsCrossed, condition: true },
                { href: '/categories', label: 'التصنيفات', icon: Tags, condition: true },
                { href: '/desks', label: "الطاولات", icon: Table, condition: shop?.business_info?.has_dine_in },
            ]
        },
        { // Operations
            key: 'operations', label: 'العمليات', icon: ClipboardList, condition: true,
            items: [
                 { href: '/orders', label: 'الطلبات', icon: ClipboardList, condition: true },
                 { href: '/desks', label: 'الطاولات و QR', icon: Table },
            ]
        },
         { // Marketing
            key: 'marketing', label: 'التسويق', icon: Percent, condition: true,
            items: [
                { href: '/coupons', label: 'الكوبونات', icon: Tag, condition: true }, // Changed icon
            ]
        },    ];


    return (
        <aside
            className={`bg-white border-l border-gray-200 flex flex-col fixed inset-y-0 right-0 z-30 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0 shadow-lg' : 'translate-x-full'
            }`}
            dir="rtl"
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0 px-4">
                <Link to="/" className="text-center">
                    <h1 className="text-xl font-bold" style={{ color: primaryColor }}>Orbis Q</h1>
                </Link>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="flex-grow overflow-y-auto py-4 px-3">
                <ul className="space-y-1.5"> {/* Slightly more space between groups/items */}
                    {navStructure
                        .filter(group => group.condition !== false) // Filter groups based on condition
                        .map((group) => (
                        <li key={group.key}>
                            {/* Render Dashboard link directly */}
                            {group.key === 'dashboard' ? (
                                <Link
                                    to={group.items[0].href}
                                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                                        currentPath === '/' ? `text-white shadow-sm bg-[${primaryColor}]` : `text-gray-600 hover:text-[#8B0000] hover:bg-[#FDECEC]`
                                    }`}
                                >
                                     <group.icon className={`ml-3 h-5 w-5 flex-shrink-0 transition-colors duration-150 ${currentPath === '/' ? 'text-white' : 'text-gray-400 group-hover:text-[#8B0000]'}`} />
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
        </aside>
    );
};

export default Sidebar;