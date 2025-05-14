// src/components/layout/Navbar.tsx (Revised - Top Bar only)

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For dropdown animation
import { Settings, UserCircle, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- State ---
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    // Dummy user data - replace with actual data from auth state/API

    // --- Handlers ---
    const toggleUserDropdown = () => setIsUserDropdownOpen(prev => !prev);

    const handleLogout = () => {
        setIsUserDropdownOpen(false); // Close dropdown
        // dispatch(logout());
        // Optionally clear other states
        navigate('/login'); // Redirect to login
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Render ---

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
            <div className="container mx-auto max-w-none px-4 sm:px-6 lg:px-8"> {/* Full width container */}
                <div className="flex items-center justify-between h-16">

                    {/* Left Side (RTL): Branding & Potential Sidebar Toggle */}
                    <div className="flex items-center">
                        {/* Sidebar Toggle Button (Rendered here, state managed in Layout) */}
                        {/* Example: <button onClick={toggleSidebar} className="p-2 text-gray-500 lg:hidden"><Menu/></button> */}

                        {/* Brand Logo */}
                        {/* <Link to="/" className="flex-shrink-0 flex items-center ml-4">
                             <img src={AppImages.logo_slogan} alt="Orbis Q Logo" className="h-8 w-auto" />
                        </Link> */}
                    </div>

                    {/* Right Side (RTL): Search, Notifications, User Menu */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* User Avatar Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                aria-haspopup="true"
                                aria-expanded={isUserDropdownOpen}
                            >
                                <span className="sr-only">Open user menu</span>
                                 {/* User Avatar/Icon */}
                                <UserCircle size={28} className="text-gray-500" />
                                {/* User Name (Optional - Show on larger screens) */}
                                {/* <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span> */}
                                {/* Dropdown Arrow */}
                                {/* <ChevronDown size={16} className={`hidden md:block text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} /> */}
                            </button>

                            {/* Dropdown Panel */}
                            <AnimatePresence>
                                {isUserDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-sm bg-white border border-gray-200 focus:outline-none py-1" // Changed origin, position (left for RTL)
                                    >
                                        {/* Optional: User Info */}
                                         <div className="px-4 py-2 border-b border-gray-100">
                                             <p className="text-sm font-medium text-gray-800 truncate">{'Restaurant Admin'}</p>
                                             <p className="text-xs text-gray-500 truncate">{'admin@example.com'}</p>
                                         </div>
                                         {/* Links */}
                                         <Link to="/settings/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full text-right">
                                            <Settings size={16} className="text-gray-400"/> إعدادات الحساب
                                         </Link>
                                          {/* Add other relevant links */}
                                         <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-right"
                                        >
                                            <LogOut size={16} /> تسجيل الخروج
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;