import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { TourPackage } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';
import { TiltCard } from '../animations/TiltCard';

interface PackageCardProps {
  pkg: TourPackage;
  layout?: 'grid' | 'list';
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, layout = 'grid' }) => {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(pkg.id);

  if (layout === 'list') {
    return (
      <article className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
        <div className="relative md:w-80 shrink-0 overflow-hidden bg-slate-100">
          <Link to={`/packages/${pkg.slug}`} className="block h-56 md:h-full">
            <SafeImage
              src={pkg.image}
              alt={pkg.title}
              fallbackTitle={pkg.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <button
            type="button"
            onClick={() => toggleWishlist(pkg.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#102A43] hover:bg-white transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mb-1.5">
              <span className="font-medium text-[#168AAD]">
                {pkg.destinationName} · {pkg.durationLabel} · {pkg.packageType}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#102A43] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#E5AD50] text-[#E5AD50]" />
                {pkg.rating.toFixed(1)} ({pkg.reviewCount})
              </span>
            </div>

            <Link to={`/packages/${pkg.slug}`}>
              <h3 className="font-serif text-xl font-semibold text-[#102A43] group-hover:text-[#168AAD] transition-colors">
                {pkg.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">{pkg.shortDescription}</p>
            <p className="mt-2.5 text-xs text-slate-500 tabular-nums">
              Next departure: {formatDate(pkg.departureDates[0])} · {pkg.availableSeats} seats left
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-xl font-bold text-[#102A43] font-mono">{formatCurrency(pkg.price)}</span>
              {pkg.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatCurrency(pkg.originalPrice)}
                </span>
              )}
              <span className="text-xs text-slate-500">/ person</span>
            </div>

            <Link
              to={`/packages/${pkg.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] transition-colors whitespace-nowrap"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <TiltCard maxTilt={4}>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Link to={`/packages/${pkg.slug}`} className="block h-full w-full">
            <SafeImage
              src={pkg.image}
              alt={pkg.title}
              fallbackTitle={pkg.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          {pkg.discountPercent && (
            <div className="absolute top-3 left-3 bg-[#102A43]/90 text-[#E5AD50] text-xs font-semibold px-2.5 py-1 rounded-md tabular-nums">
              Save {pkg.discountPercent}%
            </div>
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(pkg.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#102A43] hover:bg-white transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
              <span className="font-medium text-[#168AAD] truncate">
                {pkg.destinationName} · {pkg.durationLabel}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#102A43] tabular-nums shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#E5AD50] text-[#E5AD50]" />
                {pkg.rating.toFixed(1)}
              </span>
            </div>

            <Link to={`/packages/${pkg.slug}`}>
              <h3 className="font-serif text-lg font-semibold text-[#102A43] group-hover:text-[#168AAD] transition-colors line-clamp-2">
                {pkg.title}
              </h3>
            </Link>

            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">{pkg.shortDescription}</p>
            <p className="mt-2.5 text-xs text-slate-500 tabular-nums">
              Departs {formatDate(pkg.departureDates[0])} · {pkg.reviewCount} reviews
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-100">
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-lg font-bold text-[#102A43] font-mono">{formatCurrency(pkg.price)}</span>
              {pkg.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatCurrency(pkg.originalPrice)}
                </span>
              )}
            </div>
            <Link
              to={`/packages/${pkg.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#102A43] hover:text-[#168AAD] transition-colors whitespace-nowrap"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
};
