import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { siteSettings, subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    subscribeNewsletter(email.trim());
    setEmail('');
  };

  return (
    <footer className="bg-[#102A43] text-slate-200 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="font-serif text-2xl font-bold text-white inline-block">
              {siteSettings.brandName}
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Crafted journeys across Northern Pakistan’s Karakoram peaks, Mughal heritage cities, and coastal sanctuaries along the Makran Highway—guided with precision and warm local hospitality.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md">
              <label htmlFor="footer-newsletter" className="block text-xs font-medium text-[#E5AD50] mb-2">
                Seasonal Expedition Dispatches
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 min-w-0 rounded-lg bg-white/10 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#E5AD50]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#E5AD50] text-[#102A43] text-xs font-semibold hover:bg-[#eab964] transition-colors whitespace-nowrap shrink-0"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/destinations" className="hover:text-[#E5AD50] transition-colors">All Destinations</Link></li>
              <li><Link to="/packages" className="hover:text-[#E5AD50] transition-colors">Tour Packages</Link></li>
              <li><Link to="/hotels" className="hover:text-[#E5AD50] transition-colors">Luxury Hotels</Link></li>
              <li><Link to="/flights" className="hover:text-[#E5AD50] transition-colors">Domestic Flights</Link></li>
              <li><Link to="/visa" className="hover:text-[#E5AD50] transition-colors">Permits &amp; E-Visa</Link></li>
              <li><Link to="/custom-tour" className="hover:text-[#E5AD50] transition-colors">Custom Tour Builder</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Featured Regions</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/destinations/hunza-valley" className="hover:text-[#E5AD50] transition-colors">Hunza Valley</Link></li>
              <li><Link to="/destinations/skardu" className="hover:text-[#E5AD50] transition-colors">Skardu &amp; Deosai</Link></li>
              <li><Link to="/destinations/fairy-meadows" className="hover:text-[#E5AD50] transition-colors">Fairy Meadows</Link></li>
              <li><Link to="/destinations/lahore" className="hover:text-[#E5AD50] transition-colors">Lahore Heritage</Link></li>
              <li><Link to="/destinations/gwadar" className="hover:text-[#E5AD50] transition-colors">Gwadar &amp; Hingol Coast</Link></li>
              <li><Link to="/destinations/swat-valley" className="hover:text-[#E5AD50] transition-colors">Swat &amp; Kalam Valley</Link></li>
            </ul>
          </div>

          {/* Contact & Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Islamabad Concierge</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5AD50] shrink-0 mt-0.5" />
                <span>Kohsar Road, Sector F-6/3, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5AD50] shrink-0" />
                <span className="tabular-nums">{siteSettings.supportPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5AD50] shrink-0" />
                <span className="truncate">{siteSettings.supportEmail}</span>
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-3 text-xs text-slate-300">
              <Link to="/about" className="hover:text-white">About Us</Link>
              <Link to="/blog" className="hover:text-white">Journal</Link>
              <Link to="/faq" className="hover:text-white">FAQs</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
              <Link to="/dashboard" className="hover:text-white">Traveler Portal</Link>
              <Link to="/admin" className="hover:text-white">Admin</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Accepted Payments: Visa · Mastercard · IBFT Bank Transfer · UnionPay</span>
            <Link to="/faq" className="hover:text-white">Privacy &amp; Cancellation Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
