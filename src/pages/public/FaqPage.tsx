import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { FAQ_CATEGORIES } from '../../data/reviewsAndAdmin';

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>('General Travel Questions-0');

  const categories = ['All', ...FAQ_CATEGORIES.map((c) => c.category)];

  const filtered = FAQ_CATEGORIES.filter(
    (c) => activeCategory === 'All' || c.category === activeCategory
  )
    .map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          !searchQuery.trim() ||
          i.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((c) => c.items.length > 0);

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-xs font-semibold text-[#168AAD] mb-1">Traveler Knowledge Base</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#102A43]">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search booking, refunds, Gilgit flights, visas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#102A43] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filtered.map((group) => (
            <div key={group.category} className="space-y-3">
              <h2 className="font-serif text-2xl font-semibold text-[#102A43]">{group.category}</h2>
              <div className="space-y-2.5">
                {group.items.map((item, idx) => {
                  const key = `${group.category}-${idx}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                      >
                        <span className="font-semibold text-sm sm:text-base text-[#102A43]">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
