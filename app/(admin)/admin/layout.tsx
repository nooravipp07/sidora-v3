'use client';

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Hammer,
  Users,
  UserCheck,
  Calendar,
  CheckCircle,
  Settings,
  Database,
  Menu,
  X,
  Bell,
  LogOut,
  Search,
  ChevronDown
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [userDropdown, setUserDropdown] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'sarana', label: 'Data Sarana', icon: Building2, href: '/admin/data-sarana' },
    { id: 'prasarana', label: 'Data Prasarana', icon: Hammer, href: '/admin/data-prasarana' },
    { id: 'klub', label: 'Data Klub', icon: Users, href: '/admin/data-klub' },
    { id: 'atlet', label: 'Data Atlet', icon: UserCheck, href: '/admin/data-atlet' },
    { id: 'kegiatan', label: 'Olahraga Masyarakat', icon: Calendar, href: '/admin/kegiatan' },
    { id: 'verifikasi', label: 'Verifikasi', icon: CheckCircle, href: '/admin/verifikasi' },
    { id: 'user', label: 'User Management', icon: Users, href: '/admin/user-management' },
    { id: 'master', label: 'Master Data', icon: Database, href: '/admin/master-data' }
  ];

  // Update active menu based on current pathname
  useEffect(() => {
    const currentItem = menuItems.find(item => item.href === pathname);
    if (currentItem) {
      setActiveMenu(currentItem.id);
    }
  }, [pathname]);

  const handleMenuClick = (href: string): void => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = (): void => {
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 hidden md:flex flex-col fixed left-0 h-full z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b">
          <div className={`flex items-center space-x-3 ${isSidebarOpen ? '' : 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {isSidebarOpen && <span className="text-xl font-bold text-gray-900">SIDORA</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.href)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-green-100 text-green-600 border-l-4 border-green-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="border-t p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-md h-20 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4 flex-1">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">superadmin@sidora.go.id</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b shadow-lg">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
