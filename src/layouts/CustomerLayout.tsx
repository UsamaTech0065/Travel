import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  CreditCard,
  FileText,
  FolderOpen,
  Heart,
  Home,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Star,
  User,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';

const CUSTOMER_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'My Profile', icon: User },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/dashboard/payments', label: 'Payment History', icon: CreditCard },
  { to: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { to: '/dashboard/documents', label: 'My Documents', icon: FolderOpen },
  { to: '/dashboard/travelers', label: 'Saved Travelers', icon: Users },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/dashboard/reviews', label: 'My Reviews', icon: Star },
  { to: '/dashboard/tickets', label: 'Support Tickets', icon: LifeBuoy },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/password', label: 'Change Password', icon: KeyRound },
];

export const CustomerLayout: React.FC = () => {
  const { user, logout, notifications } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#243447]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-slate-200 bg-white shrink-0">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <Link to="/" className="font-serif text-lg font-bold text-[#102A43]">
            Karakoram Voyages
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {CUSTOMER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#102A43] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#102A43]'
                }`
              }
            >
              <span className="flex items-center gap-2.5 truncate">
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </span>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="font-mono text-[10px] bg-[#E5AD50] text-[#102A43] px-1.5 py-0.5 rounded-md tabular-nums">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <Home className="w-4 h-4" /> Public Website
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 bg-white h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-serif font-bold text-[#102A43]">Traveler Portal</span>
              <button type="button" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {CUSTOMER_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#102A43] text-white' : 'text-slate-600'
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open portal navigation"
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-xs sm:text-sm font-semibold text-[#102A43]">
              Traveler Portal · {user?.tier || 'Summit Club'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/booking" className="px-3.5 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] whitespace-nowrap">
              New Booking
            </Link>
            <div className="flex items-center gap-2.5">
              <SafeImage
                src={user?.avatar || ''}
                alt={user?.name || 'Traveler'}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-xs font-semibold text-[#102A43]">
                {user?.name || 'Guest Traveler'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
