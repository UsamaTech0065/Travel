import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PackageCard } from '../../components/cards/PackageCard';
import { LOCAL_IMAGES } from '../../data/images';
import { SafeImage } from '../../components/common/SafeImage';
import { formatCurrency } from '../../utils/format';

export const PackagesPage: React.FC = () => {
  const { packages } = useApp();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [departureMonth, setDepartureMonth] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const destinationsList = useMemo(
    () => ['All', ...Array.from(new Set(packages.map((p) => p.destinationName)))],
    [packages]
  );

  const categories = ['All', 'Luxury Retreat', 'Expedition', 'Adventure Trek', 'Family Tour', 'Cultural Heritage', 'Honeymoon'];
  const packageTypes = ['All', 'Group Tour', 'Private Tour'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = packages.filter((p) => {
      if (destinationFilter !== 'All' && p.destinationName !== destinationFilter) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (typeFilter !== 'All' && p.packageType !== typeFilter) return false;
      if (p.price > maxPrice) return false;
      if (durationFilter === 'short' && p.durationDays > 4) return false;
      if (durationFilter === 'medium' && (p.durationDays < 5 || p.durationDays > 6)) return false;
      if (durationFilter === 'long' && p.durationDays < 7) return false;
      if (departureMonth && !p.departureDates.some((d) => d.startsWith(departureMonth))) return false;
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.destinationName.toLowerCase().includes(q) &&
        !p.country.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [packages, query, destinationFilter, categoryFilter, typeFilter, durationFilter, maxPrice, departureMonth, sortBy]);

  return (
    <div className="pt-16">
      {/* Banner */}
      <section className="relative h-72 sm:h-80 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.skardu}
          alt="Skardu Lower Kachura Lake Tour Packages"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/65 to-[#102A43]/30" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-2">Small-Group &amp; Private Departures</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Curated Tour Packages</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl">
            Every itinerary includes vetted luxury &amp; heritage lodging, 4x4 transport, and dedicated expedition leadership.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-[#102A43] inline-flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#168AAD]" />
                Filter Tours
              </h2>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDestinationFilter('All');
                  setCategoryFilter('All');
                  setTypeFilter('All');
                  setDurationFilter('All');
                  setMaxPrice(3500);
                  setDepartureMonth('');
                }}
                className="text-xs font-medium text-[#168AAD] hover:underline"
              >
                Reset
              </button>
            </div>

            <div>
              <label htmlFor="pkg-search" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Search Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="pkg-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hunza, Skardu, Swat, Deosai..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-[#168AAD] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pkg-dest" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Destination
              </label>
              <select
                id="pkg-dest"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                {destinationsList.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pkg-month" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Departure Month
              </label>
              <input
                id="pkg-month"
                type="month"
                value={departureMonth}
                onChange={(e) => setDepartureMonth(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="pkg-cat" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Tour Category
              </label>
              <select
                id="pkg-cat"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-2">Package Type</label>
              <div className="flex flex-wrap gap-1.5">
                {packageTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      typeFilter === t
                        ? 'bg-[#102A43] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="pkg-duration" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Duration
              </label>
              <select
                id="pkg-duration"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="All">Any Duration</option>
                <option value="short">3 – 4 Days</option>
                <option value="medium">5 – 6 Days</option>
                <option value="long">7+ Days</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#102A43] mb-1.5">
                <label htmlFor="pkg-price">Max Price</label>
                <span className="font-mono text-[#168AAD] tabular-nums">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                id="pkg-price"
                type="range"
                min={450}
                max={3500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#168AAD]"
              />
            </div>
          </aside>

          {/* Main Results */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5">
              <p className="text-xs font-medium text-slate-600 tabular-nums">
                {filtered.length} curated packages found
              </p>
              <div className="flex items-center gap-3">
                <select
                  aria-label="Sort packages"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#102A43]"
                >
                  <option value="featured">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLayout('grid')}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-md ${layout === 'grid' ? 'bg-[#102A43] text-white' : 'text-slate-500'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    aria-label="List view"
                    className={`p-1.5 rounded-md ${layout === 'list' ? 'bg-[#102A43] text-white' : 'text-slate-500'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="font-serif text-xl text-[#102A43]">No tour packages match your filters</p>
                <p className="text-sm text-slate-500 mt-1">Try widening your price range or clearing filters.</p>
              </div>
            ) : layout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} layout="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
