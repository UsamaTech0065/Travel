import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Review } from '../../types';
import { formatDate } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < review.rating ? 'fill-[#E5AD50] text-[#E5AD50]' : 'text-slate-200'}`}
              />
            ))}
          </div>
          {review.verifiedBooking && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Booking
            </span>
          )}
        </div>

        <p className="text-sm text-[#243447] leading-relaxed">“{review.text}”</p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <SafeImage
            src={review.avatar}
            alt={review.customerName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#102A43] truncate">{review.customerName}</p>
            <p className="text-xs text-slate-500 truncate">
              {review.customerCity} · {formatDate(review.travelDate)}
            </p>
          </div>
        </div>
        <p className="mt-2.5 text-xs font-medium text-[#168AAD] truncate">{review.packageName}</p>
      </div>
    </article>
  );
};
