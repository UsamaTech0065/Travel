import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  BlogPost,
  BookingRecord,
  Coupon,
  CustomerProfile,
  Destination,
  Employee,
  Hotel,
  Review,
  SupportTicket,
  TourPackage,
  VisaApplication,
} from '../types';
import { DESTINATIONS } from '../data/destinations';
import { TOUR_PACKAGES } from '../data/packages';
import { BLOG_POSTS } from '../data/blog';
import { HOTELS, INITIAL_COUPONS, INITIAL_VISA_APPLICATIONS } from '../data/hotelsFlightsVisa';
import {
  INITIAL_BOOKINGS,
  INITIAL_CUSTOMERS,
  INITIAL_EMPLOYEES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
} from '../data/reviewsAndAdmin';
import { LOCAL_IMAGES } from '../data/images';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar: string;
  phone: string;
  city: string;
  country: string;
  tier: string;
}

export interface SavedTraveler {
  id: string;
  fullName: string;
  relationship: string;
  dob: string;
  nationality: string;
  passportNumber: string;
}

interface AppContextValue {
  user: AuthUser | null;
  login: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;

  destinations: Destination[];
  addDestination: (dest: Destination) => void;
  updateDestination: (id: string, updates: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;

  packages: TourPackage[];
  addPackage: (pkg: TourPackage) => void;
  deletePackage: (id: string) => void;

  hotels: Hotel[];
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, status: BookingRecord['status']) => void;

  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;

  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addBlogComment: (postId: string, author: string, content: string) => void;

  visaApplications: VisaApplication[];
  addVisaApplication: (app: VisaApplication) => void;
  updateVisaStatus: (id: string, status: VisaApplication['status']) => void;

  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (id: string) => void;

  customers: CustomerProfile[];
  employees: Employee[];
  tickets: SupportTicket[];
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdate' | 'status'>) => void;

  notifications: AppNotification[];
  markAllNotificationsRead: () => void;

  wishlist: string[];
  toggleWishlist: (packageId: string) => void;

  savedTravelers: SavedTraveler[];
  addSavedTraveler: (t: Omit<SavedTraveler, 'id'>) => void;
  removeSavedTraveler: (id: string) => void;

  newsletterEmails: string[];
  subscribeNewsletter: (email: string) => void;

  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;

  siteSettings: {
    brandName: string;
    supportPhone: string;
    supportEmail: string;
    heroHeadline: string;
    currency: string;
  };
  updateSiteSettings: (updates: Partial<AppContextValue['siteSettings']>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'karakoram_voyages_pk_v2';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() =>
    loadStored('user', {
      id: 'cust-1',
      name: 'Usama Goraya',
      email: 'usamagoraya413@gmail.com',
      role: 'customer',
      avatar: LOCAL_IMAGES.avatarMan,
      phone: '+92 300 5550192',
      city: 'Islamabad',
      country: 'Pakistan',
      tier: 'Summit Club',
    })
  );

  const [destinations, setDestinations] = useState<Destination[]>(() => loadStored('destinations', DESTINATIONS));
  const [packages, setPackages] = useState<TourPackage[]>(() => loadStored('packages', TOUR_PACKAGES));
  const [hotels] = useState<Hotel[]>(HOTELS);
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadStored('bookings', INITIAL_BOOKINGS));
  const [reviews, setReviews] = useState<Review[]>(() => loadStored('reviews', INITIAL_REVIEWS));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadStored('blogPosts', BLOG_POSTS));
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>(() =>
    loadStored('visaApplications', INITIAL_VISA_APPLICATIONS)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStored('coupons', INITIAL_COUPONS));
  const [customers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadStored('tickets', INITIAL_TICKETS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadStored('notifications', INITIAL_NOTIFICATIONS)
  );
  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('wishlist', ['pkg-hunza-grand', 'pkg-skardu-deosai']));
  const [savedTravelers, setSavedTravelers] = useState<SavedTraveler[]>(() =>
    loadStored('savedTravelers', [
      {
        id: 'st-1',
        fullName: 'Sara Goraya',
        relationship: 'Spouse',
        dob: '1995-08-21',
        nationality: 'Pakistani',
        passportNumber: 'PK9041882',
      },
    ])
  );
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>(() =>
    loadStored('newsletter', ['amna.mansoor@example.com'])
  );
  const [siteSettings, setSiteSettings] = useState(() =>
    loadStored('siteSettings', {
      brandName: 'Karakoram Voyages',
      supportPhone: '+92 51 844 2910',
      supportEmail: 'concierge@karakoramvoyages.com',
      heroHeadline: 'Discover Pakistan, One Journey at a Time.',
      currency: 'USD ($)',
    })
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
      localStorage.setItem(`${STORAGE_KEY}_destinations`, JSON.stringify(destinations));
      localStorage.setItem(`${STORAGE_KEY}_packages`, JSON.stringify(packages));
      localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${STORAGE_KEY}_blogPosts`, JSON.stringify(blogPosts));
      localStorage.setItem(`${STORAGE_KEY}_visaApplications`, JSON.stringify(visaApplications));
      localStorage.setItem(`${STORAGE_KEY}_coupons`, JSON.stringify(coupons));
      localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
      localStorage.setItem(`${STORAGE_KEY}_savedTravelers`, JSON.stringify(savedTravelers));
      localStorage.setItem(`${STORAGE_KEY}_newsletter`, JSON.stringify(newsletterEmails));
      localStorage.setItem(`${STORAGE_KEY}_siteSettings`, JSON.stringify(siteSettings));
    } catch {
      // Ignore quota errors in private browsing
    }
  }, [
    user,
    destinations,
    packages,
    bookings,
    reviews,
    blogPosts,
    visaApplications,
    coupons,
    tickets,
    notifications,
    wishlist,
    savedTravelers,
    newsletterEmails,
    siteSettings,
  ]);

  const showToast = (title: string, message?: string, type: ToastItem['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
    setUser({
      id: role === 'admin' ? 'admin-1' : 'cust-1',
      name: name || (role === 'admin' ? 'Tariq Mehmood (Admin)' : 'Usama Goraya'),
      email,
      role,
      avatar: LOCAL_IMAGES.avatarMan,
      phone: '+92 300 5550192',
      city: 'Islamabad',
      country: 'Pakistan',
      tier: role === 'admin' ? 'Operations Director' : 'Summit Club',
    });
    showToast('Signed in successfully', `Welcome back to Karakoram Voyages.`);
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out', 'Your session has ended safely.', 'info');
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    showToast('Profile updated', 'Your traveler preferences have been saved.');
  };

  const addDestination = (dest: Destination) => {
    setDestinations((prev) => [dest, ...prev]);
    showToast('Location added to 3D Map', `${dest.name} is now live.`);
  };

  const updateDestination = (id: string, updates: Partial<Destination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Location updated', 'Coordinates, photos, and details synced across the 3D map.');
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    showToast('Destination removed', undefined, 'info');
  };

  const addPackage = (pkg: TourPackage) => {
    setPackages((prev) => [pkg, ...prev]);
    showToast('Tour package created', pkg.title);
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    showToast('Package removed', undefined, 'info');
  };

  const addBooking = (booking: BookingRecord) => {
    setBookings((prev) => [booking, ...prev]);
    setNotifications((prev) => [
      {
        id: `ntf-${Date.now()}`,
        title: `Booking ${booking.reference} Received`,
        message: `Your reservation for ${booking.packageTitle} is recorded.`,
        date: booking.createdAt,
        read: false,
        type: 'booking',
      },
      ...prev,
    ]);
  };

  const updateBookingStatus = (id: string, status: BookingRecord['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showToast('Booking status updated', `Status changed to ${status}.`);
  };

  const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Approved',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you for your review', 'Your travel story is now published.');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast('Review updated', `Marked as ${status}.`);
  };

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
    showToast('Article published', post.title);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Article deleted', undefined, 'info');
  };

  const addBlogComment = (postId: string, author: string, content: string) => {
    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `c-${Date.now()}`,
                  author,
                  date: new Date().toISOString().slice(0, 10),
                  content,
                },
              ],
            }
          : post
      )
    );
    showToast('Comment posted');
  };

  const addVisaApplication = (app: VisaApplication) => {
    setVisaApplications((prev) => [app, ...prev]);
    showToast('Visa application submitted', `Tracking ID: ${app.trackingCode}`);
  };

  const updateVisaStatus = (id: string, status: VisaApplication['status']) => {
    setVisaApplications((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    showToast('Visa status updated', status);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast('Coupon created', `Code ${coupon.code} is ready.`);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    showToast('Coupon status updated');
  };

  const addTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdate' | 'status'>) => {
    const today = new Date().toISOString().slice(0, 10);
    setTickets((prev) => [
      {
        ...ticket,
        id: `tkt-${Date.now()}`,
        status: 'Open',
        createdAt: today,
        lastUpdate: today,
      },
      ...prev,
    ]);
    showToast('Support ticket opened', 'Our concierge team will reply shortly.');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked read', undefined, 'info');
  };

  const toggleWishlist = (packageId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(packageId);
      const next = exists ? prev.filter((id) => id !== packageId) : [...prev, packageId];
      showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist', undefined, 'info');
      return next;
    });
  };

  const addSavedTraveler = (t: Omit<SavedTraveler, 'id'>) => {
    setSavedTravelers((prev) => [...prev, { ...t, id: `st-${Date.now()}` }]);
    showToast('Traveler added', t.fullName);
  };

  const removeSavedTraveler = (id: string) => {
    setSavedTravelers((prev) => prev.filter((t) => t.id !== id));
    showToast('Traveler removed', undefined, 'info');
  };

  const subscribeNewsletter = (email: string) => {
    if (!newsletterEmails.includes(email)) {
      setNewsletterEmails((prev) => [...prev, email]);
    }
    showToast('Subscribed to Dispatches', 'Seasonal Karakoram, Kashmir & Makran Coast guides sent monthly.');
  };

  const updateSiteSettings = (updates: Partial<AppContextValue['siteSettings']>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
    showToast('Website settings saved');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        packages,
        addPackage,
        deletePackage,
        hotels,
        bookings,
        addBooking,
        updateBookingStatus,
        reviews,
        addReview,
        updateReviewStatus,
        blogPosts,
        addBlogPost,
        deleteBlogPost,
        addBlogComment,
        visaApplications,
        addVisaApplication,
        updateVisaStatus,
        coupons,
        addCoupon,
        toggleCoupon,
        customers,
        employees,
        tickets,
        addTicket,
        notifications,
        markAllNotificationsRead,
        wishlist,
        toggleWishlist,
        savedTravelers,
        addSavedTraveler,
        removeSavedTraveler,
        newsletterEmails,
        subscribeNewsletter,
        toasts,
        showToast,
        dismissToast,
        siteSettings,
        updateSiteSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
