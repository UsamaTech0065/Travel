/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { DestinationsPage } from './pages/destinations/DestinationsPage';
import { DestinationDetailPage } from './pages/destinations/DestinationDetailPage';
import { PackagesPage } from './pages/packages/PackagesPage';
import { PackageDetailPage } from './pages/packages/PackageDetailPage';
import { BookingFlowPage } from './pages/booking/BookingFlowPage';
import { HotelsPage } from './pages/hotels/HotelsPage';
import { FlightsPage } from './pages/flights/FlightsPage';
import { VisaPage } from './pages/visa/VisaPage';
import { CustomTourPage } from './pages/public/CustomTourPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { BlogListingPage } from './pages/blog/BlogListingPage';
import { BlogDetailPage } from './pages/blog/BlogDetailPage';
import { ReviewsPage } from './pages/reviews/ReviewsPage';

// Auth Pages
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from './pages/auth/AuthPages';

// Customer Dashboard Pages
import {
  CustomerBookingDetailPage,
  CustomerBookingsPage,
  CustomerDocumentsPage,
  CustomerInvoicesPage,
  CustomerNotificationsPage,
  CustomerOverview,
  CustomerPasswordPage,
  CustomerPaymentsPage,
  CustomerProfilePage,
  CustomerReviewsPage,
  CustomerSavedTravelersPage,
  CustomerTicketsPage,
  CustomerWishlistPage,
} from './pages/customer/CustomerDashboard';

// Admin Console Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import {
  AdminBlogPage,
  AdminBookingsPage,
  AdminCommunicationPage,
  AdminCustomersPage,
  AdminDestinationsPage,
  AdminEmployeesPage,
  AdminFinancePage,
  AdminFlightsPage,
  AdminHotelsPage,
  AdminMarketingPage,
  AdminReportsPage,
  AdminReviewsPage,
  AdminSettingsPage,
  AdminToursPage,
  AdminVisaPage,
  AdminWebsitePage,
} from './pages/admin/AdminModules';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const HAS_VALID_MAPS_KEY = Boolean(MAPS_API_KEY && MAPS_API_KEY !== 'MY_GOOGLE_MAPS_API_KEY');

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  const appTree = (
    <AppProvider>
      {quotaExceeded && (
        <div className="sticky top-0 z-[100] bg-amber-50 border-b border-amber-300 px-4 py-2.5 text-center text-xs sm:text-sm text-amber-950 font-medium">
          Your free Google Maps Platform API key has exceeded its request quota. Check the{' '}
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-amber-900 hover:text-amber-700"
          >
            troubleshooting guide
          </a>{' '}
          for help.
        </div>
      )}
      <BrowserRouter>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
          {/* Public Website & Auth */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:slug" element={<PackageDetailPage />} />
            <Route path="/booking" element={<BookingFlowPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/visa" element={<VisaPage />} />
            <Route path="/custom-tour" element={<CustomTourPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogListingPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* Customer Portal (13 Screens) */}
          <Route path="/dashboard" element={<CustomerLayout />}>
            <Route index element={<CustomerOverview />} />
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route path="bookings" element={<CustomerBookingsPage />} />
            <Route path="bookings/:id" element={<CustomerBookingDetailPage />} />
            <Route path="payments" element={<CustomerPaymentsPage />} />
            <Route path="invoices" element={<CustomerInvoicesPage />} />
            <Route path="documents" element={<CustomerDocumentsPage />} />
            <Route path="travelers" element={<CustomerSavedTravelersPage />} />
            <Route path="wishlist" element={<CustomerWishlistPage />} />
            <Route path="reviews" element={<CustomerReviewsPage />} />
            <Route path="tickets" element={<CustomerTicketsPage />} />
            <Route path="notifications" element={<CustomerNotificationsPage />} />
            <Route path="password" element={<CustomerPasswordPage />} />
          </Route>

          {/* SaaS Admin Console (17 Screens) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="website" element={<AdminWebsitePage />} />
            <Route path="destinations" element={<AdminDestinationsPage />} />
            <Route path="tours" element={<AdminToursPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="hotels" element={<AdminHotelsPage />} />
            <Route path="flights" element={<AdminFlightsPage />} />
            <Route path="visa" element={<AdminVisaPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="employees" element={<AdminEmployeesPage />} />
            <Route path="communication" element={<AdminCommunicationPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );

  if (HAS_VALID_MAPS_KEY && MAPS_API_KEY) {
    return (
      <APIProvider
        apiKey={MAPS_API_KEY}
        version="alpha"
        libraries={['maps3d', 'marker']}
        language="en"
        region="PK"
        onError={() => window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'))}
      >
        {appTree}
      </APIProvider>
    );
  }

  return appTree;
}
