// src/components/layout/AdminLayout.tsx (Revised)

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Import Menu icon for Navbar toggle
import Navbar from './navbar';
import AppImages from '../constants/app_images';
import Sidebar from './sidebar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">

      {/* Sidebar: Pass state */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

       {/* Mobile Overlay when Sidebar is open */}
        {isSidebarOpen && (
             <div
                 className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                 onClick={toggleSidebar}
                 aria-hidden="true"
             ></div>
         )}

      {/* Main Content Area */}
      {/* Adjust margin based on permanent sidebar on large screens */}
      <div className="flex-1 flex flex-col lg:mr-64"> {/* Added lg:mr-64 */}

        {/* Navbar - Simplified */}
         <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16 flex-shrink-0">
             <div className="container mx-auto max-w-none px-4 sm:px-6 lg:px-8">
                 <div className="flex items-center justify-between h-16">
                     {/* Left Side: Sidebar Toggle (Mobile) & Branding */}
                     <div className="flex items-center">
                          {/* Sidebar Toggle Button */}
                          <button onClick={toggleSidebar} className="p-2 text-gray-500 lg:hidden mr-2" aria-label="Toggle Sidebar">
                              <Menu/>
                          </button>
                          {/* Brand Logo/Name */}
                          <Link to="/" className="flex-shrink-0 flex items-center">
                               <img src={AppImages.logo_slogan} alt="Orbis Q Logo" className="h-8 w-auto" />
                          </Link>
                     </div>
                     {/* Right Side: Actions from Simplified Navbar */}
                      <Navbar /> {/* Render the simplified Navbar content here */}
                 </div>
             </div>
         </nav>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;