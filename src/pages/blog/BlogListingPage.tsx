import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BLOG_CATEGORIES } from '../../data/blog';
import { BlogCard } from '../../components/cards/BlogCard';
import { SafeImage } from '../../components/common/SafeImage';
import { formatDate } from '../../utils/format';

export const BlogListingPage: React.FC = () => {
  const { blogPosts } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [destination, setDestination] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const featured = blogPosts.find((b) => b.featured) || blogPosts[0];
  const trendingPosts = useMemo(() => [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 4), [blogPosts]);
  const destinationsList = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map((b) => b.destination)))],
    [blogPosts]
  );
  const allTags = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.flatMap((b) => b.tags))).slice(0, 12)],
    [blogPosts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = blogPosts.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (destination !== 'All' && p.destination !== destination) return false;
      if (selectedTag !== 'All' && !p.tags.includes(selectedTag)) return false;
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.excerpt.toLowerCase().includes(q) &&
        !p.destination.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
    if (sortBy === 'views') return [...list].sort((a, b) => b.views - a.views);
    return [...list].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  }, [blogPosts, query, category, destination, selectedTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Hero */}
        <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#168AAD] mb-1.5">The Karakoram Journal</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#102A43]">
              Travel Guides &amp; Field Dispatches
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            In-depth seasonal planning, northern road trip logistics, cultural essays, and Northern permit checklists written by our expedition directors.
          </p>
        </div>

        {/* Featured Editorial Story */}
        {featured && (
          <article className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <Link to={`/blog/${featured.slug}`} className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100">
              <SafeImage
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#168AAD] mb-2">
                  Featured Guide · {featured.category} · {featured.readingTime}
                </p>
                <Link to={`/blog/${featured.slug}`}>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43] hover:text-[#168AAD] transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{featured.excerpt}</p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SafeImage src={featured.author.avatar} alt={featured.author.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-[#102A43]">{featured.author.name}</p>
                    <p className="text-[11px] text-slate-500">{formatDate(featured.publishDate)}</p>
                  </div>
                </div>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#102A43] hover:text-[#168AAD]"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Filters + Grid + Popular Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9 space-y-6">
            {/* Filter Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search articles..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm"
                  />
                </div>
                <select
                  aria-label="Filter by blog category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <option value="All">All Categories</option>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by destination"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  {destinationsList.map((d) => (
                    <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>
                  ))}
                </select>
                <select
                  aria-label="Sort articles"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'views')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <option value="latest">Latest Published</option>
                  <option value="views">Most Read</option>
                </select>
              </div>
            </div>

            {paginated.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="font-serif text-xl text-[#102A43]">No articles match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginated.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tabular-nums ${
                      page === i + 1 ? 'bg-[#102A43] text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular & Tags Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#102A43]">Popular Dispatches</h3>
              <div className="divide-y divide-slate-100">
                {trendingPosts.map((p, idx) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="block py-3 group">
                    <p className="text-[11px] font-mono text-[#168AAD] tabular-nums">
                      0{idx + 1}. {p.views.toLocaleString()} reads
                    </p>
                    <p className="text-sm font-semibold text-[#102A43] group-hover:text-[#168AAD] mt-0.5">
                      {p.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#102A43]">Browse Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#102A43] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
