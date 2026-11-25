import React, { useMemo, useState } from 'react';
import { Camera, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewCard } from '../../components/cards/ReviewCard';
import { SafeImage } from '../../components/common/SafeImage';

export const ReviewsPage: React.FC = () => {
  const { reviews, packages, bookings, addReview, user } = useApp();

  const [destFilter, setDestFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [photosOnly, setPhotosOnly] = useState(false);

  // Submission state
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const approved = useMemo(() => reviews.filter((r) => r.status === 'Approved'), [reviews]);
  const destinations = useMemo(
    () => ['All', ...Array.from(new Set(approved.map((r) => r.destinationName)))],
    [approved]
  );

  const filtered = useMemo(() => {
    return approved.filter((r) => {
      if (destFilter !== 'All' && r.destinationName !== destFilter) return false;
      if (ratingFilter > 0 && r.rating < ratingFilter) return false;
      if (photosOnly && (!r.photos || r.photos.length === 0)) return false;
      return true;
    });
  }, [approved, destFilter, ratingFilter, photosOnly]);

  const avgRating = useMemo(() => {
    if (approved.length === 0) return 5;
    return approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  }, [approved]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const bk = bookings.find((b) => b.id === selectedBookingId);
    const pkg = packages.find((p) => p.id === bk?.packageId) || packages[0];

    addReview({
      customerName: user?.name || 'Verified Guest',
      customerCity: user ? `${user.city}, ${user.country}` : 'Islamabad, Pakistan',
      avatar: user?.avatar || pkg.image,
      packageId: pkg.id,
      packageName: pkg.title,
      destinationName: pkg.destinationName,
      rating,
      travelDate: bk?.departureDate || new Date().toISOString().slice(0, 10),
      verifiedBooking: true,
      text: reviewText.trim(),
      photos: photoPreview ? [photoPreview] : undefined,
    });
    setReviewText('');
    setPhotoPreview('');
  };

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <p className="text-xs font-semibold text-[#168AAD] mb-1.5">Verified Expedition Feedback</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#102A43]">
            Traveler Reviews &amp; Photo Stories
          </h1>
        </div>

        {/* Summary & Submission Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="text-center pr-5 border-r border-slate-200">
                <p className="font-mono text-4xl font-bold text-[#102A43] tabular-nums">{avgRating.toFixed(1)}</p>
                <div className="flex justify-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#E5AD50] text-[#E5AD50]" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1 tabular-nums">{approved.length} published</p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3].map((stars) => {
                  const count = approved.filter((r) => r.rating === stars).length;
                  const pct = approved.length ? Math.round((count / approved.length) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-10 font-mono text-slate-600 tabular-nums">{stars}★</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-[#E5AD50]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-slate-500 tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  aria-label="Filter by destination"
                  value={destFilter}
                  onChange={(e) => setDestFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                >
                  {destinations.map((d) => (
                    <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by rating"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5 Stars Only</option>
                  <option value={4}>4+ Stars</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#102A43] cursor-pointer">
                <input
                  type="checkbox"
                  checked={photosOnly}
                  onChange={(e) => setPhotosOnly(e.target.checked)}
                  className="rounded accent-[#168AAD]"
                />
                Show photo reviews only
              </label>
            </div>
          </div>

          {/* Submit Review Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#102A43]">Submit a Verified Review</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Completed Booking</label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.reference} — {b.packageTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Your Star Rating</label>
                <div className="flex items-center gap-2 py-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} aria-label={`${s} stars`}>
                      <Star className={`w-6 h-6 ${s <= rating ? 'fill-[#E5AD50] text-[#E5AD50]' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              rows={3}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell future travelers about your guides, accommodation, and favorite valley..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#102A43] cursor-pointer hover:bg-slate-50">
                <Camera className="w-4 h-4 text-[#168AAD]" />
                {photoPreview ? 'Photo Ready' : 'Attach Travel Photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setPhotoPreview(String(reader.result || ''));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
              >
                Publish Review
              </button>
            </div>
          </form>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev) => (
            <div key={rev.id} className="space-y-3">
              <ReviewCard review={rev} />
              {rev.photos && rev.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {rev.photos.map((photo, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                      <SafeImage src={photo} alt={`${rev.destinationName} guest photo`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
