import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Building2,
  Calendar,
  Car,
  Check,
  ChevronDown,
  Heart,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { SafeImage } from '../../components/common/SafeImage';
import { ReviewCard } from '../../components/cards/ReviewCard';
import { PackageCard } from '../../components/cards/PackageCard';

const OPTIONAL_SERVICES = [
  { id: 'pickup', label: 'Private Airport VIP Pickup', price: 65 },
  { id: 'insurance', label: 'Comprehensive Travel Insurance Plus', price: 85 },
  { id: 'photo', label: 'Dedicated Expedition Photographer (Day)', price: 140 },
];

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { packages, reviews, wishlist, toggleWishlist, addReview, user } = useApp();

  const pkg = packages.find((p) => p.slug === slug) || packages[0];
  const isWishlisted = wishlist.includes(pkg.id);

  // Sticky booking card state
  const [departureDate, setDepartureDate] = useState(pkg.departureDates[0] || '2027-05-15');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState<'Standard Twin' | 'Deluxe Panorama' | 'Executive Suite'>('Deluxe Panorama');
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['pickup']);
  const [openDay, setOpenDay] = useState<number>(1);

  // Review submission form
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const roomUpcharge = roomType === 'Executive Suite' ? 240 : roomType === 'Deluxe Panorama' ? 110 : 0;
  const extrasTotal = selectedExtras.reduce(
    (sum, id) => sum + (OPTIONAL_SERVICES.find((s) => s.id === id)?.price || 0),
    0
  );
  const calculatedTotal = adults * pkg.price + children * Math.round(pkg.price * 0.65) + roomUpcharge + extrasTotal;

  const pkgReviews = reviews.filter((r) => r.packageId === pkg.id && r.status === 'Approved');
  const relatedPackages = packages.filter((p) => p.id !== pkg.id && (p.region === pkg.region || p.category === pkg.category)).slice(0, 3);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const proceedToBooking = () => {
    const params = new URLSearchParams({
      package: pkg.id,
      date: departureDate,
      adults: String(adults),
      children: String(children),
      room: roomType,
      extras: selectedExtras.join(','),
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    addReview({
      customerName: user?.name || 'Verified Traveler',
      customerCity: user ? `${user.city}, ${user.country}` : 'Islamabad, Pakistan',
      avatar: user?.avatar || pkg.image,
      packageId: pkg.id,
      packageName: pkg.title,
      destinationName: pkg.destinationName,
      rating: newRating,
      travelDate: new Date().toISOString().slice(0, 10),
      verifiedBooking: true,
      text: newReviewText.trim(),
    });
    setNewReviewText('');
  };

  return (
    <div className="pt-16 pb-24 lg:pb-12">
      {/* Gallery Header */}
      <section className="bg-[#102A43] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#E5AD50] mb-1.5">
                {pkg.region} · {pkg.destinationName} · {pkg.packageType}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold">
                {pkg.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <span className="inline-flex items-center gap-1 font-semibold text-white tabular-nums">
                  <Star className="w-4 h-4 fill-[#E5AD50] text-[#E5AD50]" />
                  {pkg.rating.toFixed(1)} ({pkg.reviewCount} reviews)
                </span>
                <span>·</span>
                <span>{pkg.durationLabel}</span>
                <span>·</span>
                <span className="text-emerald-300 font-medium tabular-nums">{pkg.availableSeats} seats remaining</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(pkg.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/25 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isWishlisted ? 'Saved to Wishlist' : 'Save Tour'}
            </button>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            className="rounded-2xl overflow-hidden"
          >
            {pkg.gallery.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="aspect-[16/10] bg-slate-800 overflow-hidden rounded-xl">
                  <SafeImage src={img} alt={`${pkg.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Main Content + Sticky Booking Sidebar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 8 Columns */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43] mb-3">
                Expedition Overview
              </h2>
              <p className="text-slate-600 leading-relaxed">{pkg.overview}</p>
            </div>

            {/* Logistics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <Building2 className="w-5 h-5 text-[#168AAD] mb-2" />
                <p className="text-xs font-semibold text-slate-500">Accommodation</p>
                <p className="text-sm font-semibold text-[#102A43] mt-0.5">{pkg.hotelInfo.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{pkg.hotelInfo.category}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <Car className="w-5 h-5 text-[#168AAD] mb-2" />
                <p className="text-xs font-semibold text-slate-500">Transportation</p>
                <p className="text-sm font-semibold text-[#102A43] mt-0.5">{pkg.transportDetails}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <MapPin className="w-5 h-5 text-[#168AAD] mb-2" />
                <p className="text-xs font-semibold text-slate-500">Meeting &amp; Pickup</p>
                <p className="text-sm font-semibold text-[#102A43] mt-0.5">{pkg.pickupPoints.join(' · ')}</p>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43] mb-5">
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-3">
                {pkg.itinerary.map((day) => {
                  const isOpen = openDay === day.day;
                  return (
                    <div key={day.day} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenDay(isOpen ? 0 : day.day)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#168AAD] shrink-0 tabular-nums">
                            DAY {String(day.day).padStart(2, '0')}
                          </span>
                          <span className="font-semibold text-[#102A43] text-sm sm:text-base truncate">
                            {day.title}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 space-y-2 border-t border-slate-100">
                          <p className="leading-relaxed">{day.description}</p>
                          <p className="text-xs font-medium text-slate-500 pt-1">
                            Meals: {day.meals} · Stay: {day.accommodation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included vs Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-[#102A43] mb-4">Included Services</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {pkg.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-[#102A43] mb-4">Excluded Services</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {pkg.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Travel Info & Cancellation */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-[#102A43] inline-flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#168AAD]" />
                  Important Travel Information
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {pkg.importantInfo.map((info) => (
                    <li key={info}>• {info}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-semibold text-[#102A43] inline-flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cancellation &amp; Rescheduling Policy
                </h3>
                <p className="text-sm text-slate-600">{pkg.cancellationPolicy}</p>
              </div>
            </div>

            {/* Package Reviews + Write Review */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43]">
                  Guest Reviews ({pkgReviews.length})
                </h2>
                <span className="font-mono text-sm font-bold text-[#102A43] tabular-nums">
                  {pkg.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {pkgReviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pkgReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <h3 className="font-semibold text-[#102A43] text-sm">Share Your Experience</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-[#E5AD50] text-[#E5AD50]' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  required
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Describe your guides, hotels, and highlights..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#168AAD] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Right 4 Columns: Sticky Desktop Booking Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-2xl font-bold text-[#102A43] tabular-nums">
                    {formatCurrency(pkg.price)}
                  </span>
                  <span className="text-xs text-slate-500"> / adult</span>
                  {pkg.originalPrice && (
                    <span className="ml-2 font-mono text-xs text-slate-400 line-through tabular-nums">
                      {formatCurrency(pkg.originalPrice)}
                    </span>
                  )}
                </div>
                {pkg.discountPercent && (
                  <span className="text-xs font-semibold text-emerald-700">Save {pkg.discountPercent}%</span>
                )}
              </div>

              <div>
                <label htmlFor="bk-date" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#168AAD]" />
                  Departure Date
                </label>
                <select
                  id="bk-date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                >
                  {pkg.departureDates.map((d) => (
                    <option key={d} value={d}>{formatDate(d)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bk-adults" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Adults
                  </label>
                  <select
                    id="bk-adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bk-children" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Children
                  </label>
                  <select
                    id="bk-children"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="bk-room" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Room Tier
                </label>
                <select
                  id="bk-room"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as typeof roomType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <option value="Standard Twin">Standard Twin (Included)</option>
                  <option value="Deluxe Panorama">Deluxe Panorama (+$110)</option>
                  <option value="Executive Suite">Executive Suite (+$240)</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#102A43] mb-2">Optional Enhancements</p>
                <div className="space-y-2">
                  {OPTIONAL_SERVICES.map((srv) => (
                    <label key={srv.id} className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(srv.id)}
                          onChange={() => toggleExtra(srv.id)}
                          className="rounded accent-[#168AAD]"
                        />
                        {srv.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">+{formatCurrency(srv.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#102A43]">Estimated Total</span>
                <span className="font-mono text-2xl font-bold text-[#102A43] tabular-nums">
                  {formatCurrency(calculatedTotal)}
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={proceedToBooking}
                  className="w-full py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
                >
                  Book Now
                </button>
                <Link
                  to={`/custom-tour?dest=${encodeURIComponent(pkg.destinationName)}`}
                  className="block w-full text-center py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-[#102A43] hover:bg-slate-50 transition-colors"
                >
                  Request a Private Quote
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">
              You May Also Consider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Compact Sticky Bar (under 15% mobile viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <p className="text-[11px] text-slate-500">Total Estimate</p>
          <p className="font-mono text-base font-bold text-[#102A43] tabular-nums">{formatCurrency(calculatedTotal)}</p>
        </div>
        <button
          type="button"
          onClick={proceedToBooking}
          className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold whitespace-nowrap"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
