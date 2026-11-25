import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Destination } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { TiltCard } from '../animations/TiltCard';

interface DestinationCardProps {
  destination: Destination;
  layout?: 'grid' | 'list';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <article className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
        <Link to={`/destinations/${destination.slug}`} className="md:w-72 shrink-0 overflow-hidden bg-slate-100">
          <SafeImage
            src={destination.image}
            alt={destination.name}
            fallbackTitle={destination.name}
            className="h-56 md:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <p className="text-xs font-medium text-[#168AAD] mb-1.5">
              {destination.region} · {destination.country} · {destination.bestSeason}
            </p>
            <Link to={`/destinations/${destination.slug}`}>
              <h3 className="font-serif text-2xl font-semibold text-[#102A43] group-hover:text-[#168AAD] transition-colors">
                {destination.name}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{destination.shortDescription}</p>
          </div>
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {destination.availableTours} curated tours · {destination.elevationOrClimate}
            </span>
            <Link
              to={`/destinations/${destination.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#102A43] hover:text-[#168AAD] transition-colors whitespace-nowrap"
            >
              Explore Destination <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <TiltCard maxTilt={4}>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg h-full">
        <Link to={`/destinations/${destination.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <SafeImage
            src={destination.image}
            alt={destination.name}
            fallbackTitle={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="text-xs font-medium text-[#168AAD] mb-1">
              {destination.country} · {destination.bestSeason}
            </p>
            <Link to={`/destinations/${destination.slug}`}>
              <h3 className="font-serif text-xl font-semibold text-[#102A43] group-hover:text-[#168AAD] transition-colors">
                {destination.name}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {destination.shortDescription}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {destination.availableTours} Tours
            </span>
            <Link
              to={`/destinations/${destination.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#102A43] hover:text-[#168AAD] transition-colors whitespace-nowrap"
            >
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
};
