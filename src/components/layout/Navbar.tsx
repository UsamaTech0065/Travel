import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteSettings, user, destinations } = useApp();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const solidHeader = !isHome || scrolled || openMenu !== null;

  return (
    <header
      onMouseLeave={() => setOpenMenu(null)}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        solidHeader
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#102A43]'
          : 'bg-gradient-to-b from-[#102A43]/80 to-transparent text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-xl lg:text-2xl font-bold tracking-tight whitespace-nowrap shrink-0"
          >
            {siteSettings.brandName}
          </Link>

          {/* Zone 2: 5 concise single-line nav items with dropdowns/mega-menu */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {/* 1. Destinations Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('destinations')}
            >
              <button
                type="button"
                onClick={() => navigate('/destinations')}
                className="inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#168AAD] transition-colors"
              >
                Destinations
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>

              {openMenu === 'destinations' && (
                <div className="absolute left-0 top-full pt-2 w-[560px]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-[#243447] grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-[#168AAD] mb-2.5">Northern Valleys</p>
                      <ul className="space-y-1.5 text-sm">
                        <li><Link to="/destinations/hunza-valley" className="hover:text-[#168AAD]">Hunza Valley</Link></li>
                        <li><Link to="/destinations/skardu" className="hover:text-[#168AAD]">Skardu &amp; Shigar</Link></li>
                        <li><Link to="/destinations/fairy-meadows" className="hover:text-[#168AAD]">Fairy Meadows</Link></li>
                        <li><Link to="/destinations/naran-kaghan" className="hover:text-[#168AAD]">Naran Kaghan</Link></li>
                        <li><Link to="/destinations/swat-valley" className="hover:text-[#168AAD]">Swat Valley</Link></li>
                        <li><Link to="/destinations/kalam-valley" className="hover:text-[#168AAD]">Kalam Valley</Link></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#168AAD] mb-2.5">Lakes &amp; High Passes</p>
                      <ul className="space-y-1.5 text-sm">
                        <li><Link to="/destinations/deosai-national-park" className="hover:text-[#168AAD]">Deosai Plains</Link></li>
                        <li><Link to="/destinations/attabad-lake" className="hover:text-[#168AAD]">Attabad Lake</Link></li>
                        <li><Link to="/destinations/passu-cones" className="hover:text-[#168AAD]">Passu Cones</Link></li>
                        <li><Link to="/destinations/khunjerab-pass" className="hover:text-[#168AAD]">Khunjerab Pass</Link></li>
                        <li><Link to="/destinations/neelum-valley" className="hover:text-[#168AAD]">Neelum Valley</Link></li>
                        <li><Link to="/destinations/ratti-gali-lake" className="hover:text-[#168AAD]">Ratti Gali Lake</Link></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#168AAD] mb-2.5">Heritage &amp; Coast</p>
                      <ul className="space-y-1.5 text-sm">
                        <li><Link to="/destinations/lahore" className="hover:text-[#168AAD]">Lahore</Link></li>
                        <li><Link to="/destinations/islamabad" className="hover:text-[#168AAD]">Islamabad</Link></li>
                        <li><Link to="/destinations/gwadar" className="hover:text-[#168AAD]">Gwadar Coast</Link></li>
                        <li><Link to="/destinations/hingol-national-park" className="hover:text-[#168AAD]">Hingol National Park</Link></li>
                        <li><Link to="/destinations/cholistan-desert" className="hover:text-[#168AAD]">Cholistan Desert</Link></li>
                        <li className="pt-2">
                          <Link to="/destinations" className="text-xs font-semibold text-[#102A43] underline underline-offset-4">
                            View All {destinations.length} Destinations
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tour Packages */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('packages')}
            >
              <button
                type="button"
                onClick={() => navigate('/packages')}
                className="inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#168AAD] transition-colors"
              >
                Tour Packages
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>
              {openMenu === 'packages' && (
                <div className="absolute left-0 top-full pt-2 w-60">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-[#243447] flex flex-col gap-1 text-sm">
                    <Link to="/packages" className="px-3 py-2 rounded-lg hover:bg-slate-50">All Tour Packages</Link>
                    <Link to="/custom-tour" className="px-3 py-2 rounded-lg hover:bg-slate-50">Custom Tour Request</Link>
                    <Link to="/reviews" className="px-3 py-2 rounded-lg hover:bg-slate-50">Traveler Reviews</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Services (Hotels, Domestic Flights, Permits) */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('services')}
            >
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'services' ? null : 'services')}
                className="inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#168AAD] transition-colors"
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>
              {openMenu === 'services' && (
                <div className="absolute left-0 top-full pt-2 w-56">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-[#243447] flex flex-col gap-1 text-sm">
                    <Link to="/hotels" className="px-3 py-2 rounded-lg hover:bg-slate-50">Hotels &amp; Resorts</Link>
                    <Link to="/flights" className="px-3 py-2 rounded-lg hover:bg-slate-50">Domestic Flights</Link>
                    <Link to="/visa" className="px-3 py-2 rounded-lg hover:bg-slate-50">Permits &amp; E-Visa</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Journal & Company */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('journal')}
            >
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#168AAD] transition-colors"
              >
                Travel Blog
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>
              {openMenu === 'journal' && (
                <div className="absolute left-0 top-full pt-2 w-52">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-[#243447] flex flex-col gap-1 text-sm">
                    <Link to="/blog" className="px-3 py-2 rounded-lg hover:bg-slate-50">All Travel Stories</Link>
                    <Link to="/about" className="px-3 py-2 rounded-lg hover:bg-slate-50">About Us</Link>
                    <Link to="/faq" className="px-3 py-2 rounded-lg hover:bg-slate-50">Travel FAQs</Link>
                    <Link to="/contact" className="px-3 py-2 rounded-lg hover:bg-slate-50">Contact Us</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Account / Portal */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('portal')}
            >
              <button
                type="button"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#168AAD] transition-colors"
              >
                {user ? 'Account' : 'Login'}
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>
              {openMenu === 'portal' && (
                <div className="absolute right-0 top-full pt-2 w-56">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-[#243447] flex flex-col gap-1 text-sm">
                    <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-slate-50">Customer Dashboard</Link>
                    <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-slate-50">Admin Console</Link>
                    <div className="my-1 border-t border-slate-100" />
                    <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-slate-50">Sign In</Link>
                    <Link to="/register" className="px-3 py-2 rounded-lg hover:bg-slate-50">Create Account</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/booking"
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                solidHeader
                  ? 'bg-[#102A43] text-white hover:bg-[#168AAD]'
                  : 'bg-[#E5AD50] text-[#102A43] hover:bg-[#eab964]'
              }`}
            >
              Book Now
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white text-[#102A43] max-h-[82vh] overflow-y-auto px-5 py-5 space-y-5 shadow-xl">
          <div className="grid grid-cols-2 gap-3 text-sm font-medium">
            <NavLink to="/" className="py-2">Home</NavLink>
            <NavLink to="/destinations" className="py-2">Destinations</NavLink>
            <NavLink to="/packages" className="py-2">Tour Packages</NavLink>
            <NavLink to="/hotels" className="py-2">Hotels</NavLink>
            <NavLink to="/flights" className="py-2">Domestic Flights</NavLink>
            <NavLink to="/visa" className="py-2">Permits &amp; E-Visa</NavLink>
            <NavLink to="/custom-tour" className="py-2">Custom Tour</NavLink>
            <NavLink to="/blog" className="py-2">Travel Blog</NavLink>
            <NavLink to="/reviews" className="py-2">Reviews</NavLink>
            <NavLink to="/about" className="py-2">About Us</NavLink>
            <NavLink to="/faq" className="py-2">FAQs</NavLink>
            <NavLink to="/contact" className="py-2">Contact</NavLink>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
            <Link
              to="/booking"
              className="flex-1 text-center py-2.5 px-4 rounded-lg bg-[#102A43] text-white text-sm font-semibold"
            >
              Book Now
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 text-center py-2.5 px-4 rounded-lg border border-slate-300 text-sm font-semibold"
            >
              Customer Portal
            </Link>
            <Link
              to="/admin"
              className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-100 text-sm font-semibold"
            >
              Admin Console
            </Link>
            <div className="w-full flex gap-2.5 pt-1">
              <Link to="/login" className="flex-1 text-center py-2 text-xs font-medium text-slate-600">Login</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-xs font-medium text-slate-600">Register</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
