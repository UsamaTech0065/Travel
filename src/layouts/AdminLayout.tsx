import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  BedDouble,
  Briefcase,
  CalendarCheck,
  Compass,
  DollarSign,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Plane,
  Settings,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/website', label: 'Website Management', icon: Globe },
  { to: '/admin/destinations', label: '3D Map & Locations', icon: MapPin },
  { to: '/admin/tours', label: 'Tour Management', icon: Compass },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/hotels', label: 'Hotels', icon: BedDouble },
  { to: '/admin/flights', label: 'Domestic Flights', icon: Plane },
  { to: '/admin/visa', label: 'Permits & E-Visa', icon: ShieldCheck },
  { to: '/admin/blog', label: 'Blog Management', icon: FileText },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/marketing', label: 'Marketing & Coupons', icon: Megaphone },
  { to: '/admin/finance', label: 'Finance', icon: DollarSign },
  { to: '/admin/employees', label: 'Employees & Roles', icon: Briefcase },
  { to: '/admin/communication', label: 'Communication', icon: Mail },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, bookings, reviews } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#243447]">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#102A43] text-slate-200 shrink-0">
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link to="/admin" className="font-serif text-lg font-bold text-white">
            Karakoram Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#168AAD] text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-2.5 truncate">
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </span>
              {item.label === 'Bookings' && pendingBookingsCount > 0 && (
                <span className="font-mono text-[10px] bg-[#E5AD50] text-[#102A43] px-1.5 py-0.5 rounded font-bold tabular-nums">
                  {pendingBookingsCount}
                </span>
              )}
              {item.label === 'Reviews' && pendingReviewsCount > 0 && (
                <span className="font-mono text-[10px] bg-[#E5AD50] text-[#102A43] px-1.5 py-0.5 rounded font-bold tabular-nums">
                  {pendingReviewsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10"
          >
            <Home className="w-4 h-4" /> View Live Website
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10"
          >
            <Users className="w-4 h-4" /> Customer Portal
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 bg-[#102A43] text-white h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-serif font-bold">Karakoram Admin</span>
              <button type="button" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {ADMIN_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-[#168AAD] text-white' : 'text-slate-300'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main SaaS Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-[#102A43]">
              Operations Console · Karakoram Voyages
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#102A43] hover:bg-slate-50"
            >
              Public Site
            </Link>
            <span className="text-xs font-medium text-slate-600">
              {user?.name || 'Operations Director'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
