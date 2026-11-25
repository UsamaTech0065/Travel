import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe2, LayoutGrid, List, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DestinationCard } from '../../components/cards/DestinationCard';
import { LOCAL_IMAGES } from '../../data/images';
import { SafeImage } from '../../components/common/SafeImage';
import { Pakistan3DMap } from '../../components/maps/Pakistan3DMap';

export const DestinationsPage: React.FC = () => {
  const { destinations } = useApp();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>(searchParams.get('region') || 'All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'tours' | 'az'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = ['All', 'Mountains', 'Lakes & Valleys', 'Heritage & Culture', 'Coast & Desert', 'Luxury & City'];
  const regions = ['All', 'Northern Pakistan', 'Pakistan Heritage & Coast'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = destinations.filter((d) => {
      if (regionFilter !== 'All' && d.region !== regionFilter) return false;
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (
        q &&
        !d.name.toLowerCase().includes(q) &&
        !d.category.toLowerCase().includes(q) &&
        !d.shortDescription.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'tours') return [...list].sort((a, b) => b.availableTours - a.availableTours);
    if (sortBy === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [destinations, query, regionFilter, categoryFilter, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="pt-16">
      {/* Page Banner */}
      <section className="relative h-72 sm:h-80 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.attabadPassu}
          alt="Attabad Lake and Passu Cones in Northern Pakistan"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/65 to-[#102A43]/30" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-2">
            {destinations.length} Hand-Curated Pakistan Destinations
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Explore Pakistan Destinations</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl">
            From high-altitude Karakoram sanctuaries and Mughal heritage cities to the Makran coastline and Cholistan sands.
          </p>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder="Search Hunza, Skardu, Swat, Lahore, Gwadar..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:bg-white focus:border-[#168AAD] focus:outline-none"
              />
            </div>

            <select
              aria-label="Filter by region"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setVisibleCount(12);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#168AAD] focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All Pakistan Regions' : r}</option>
              ))}
            </select>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#168AAD] focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 tabular-nums">
              Showing {viewMode === 'map' ? filtered.length : visible.length} of {filtered.length} destinations
            </p>
            <div className="flex items-center gap-3">
              <select
                aria-label="Sort destinations"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'tours' | 'az')}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#102A43]"
              >
                <option value="featured">Featured First</option>
                <option value="tours">Most Tours Available</option>
                <option value="az">Alphabetical (A–Z)</option>
              </select>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#102A43] text-white' : 'text-slate-500'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#102A43] text-white' : 'text-slate-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  aria-label="3D Map view"
                  className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold ${
                    viewMode === 'map' ? 'bg-[#168AAD] text-white' : 'text-slate-600 hover:text-[#102A43]'
                  }`}
                >
                  <Globe2 className="w-4 h-4" />
                  <span className="hidden sm:inline">3D Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="font-serif text-xl text-[#102A43]">No destinations match those filters</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRegionFilter('All');
                setCategoryFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'map' ? (
          <Pakistan3DMap locations={filtered} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((d) => (
              <DestinationCard key={d.id} destination={d} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {visible.map((d) => (
              <DestinationCard key={d.id} destination={d} layout="list" />
            ))}
          </div>
        )}

        {viewMode !== 'map' && visibleCount < filtered.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 12)}
              className="px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
            >
              Load More Destinations ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
