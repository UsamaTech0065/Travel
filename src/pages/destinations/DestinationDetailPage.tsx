import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, CloudSun, MapPin, Mountain, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../../components/common/SafeImage';
import { PackageCard } from '../../components/cards/PackageCard';
import { DestinationCard } from '../../components/cards/DestinationCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { ReviewCard } from '../../components/cards/ReviewCard';
import { TiltCard } from '../../components/animations/TiltCard';
import { Pakistan3DMap } from '../../components/maps/Pakistan3DMap';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { destinations, packages, reviews, blogPosts } = useApp();
  const [activePhoto, setActivePhoto] = useState(0);

  const destination = destinations.find((d) => d.slug === slug) || destinations[0];
  const gallery = destination.gallery.length > 0 ? destination.gallery : [destination.image];

  const availablePackages = packages.filter(
    (p) => p.destinationId === destination.id || p.country === destination.country
  );
  const destReviews = reviews.filter(
    (r) => r.destinationName.toLowerCase() === destination.name.toLowerCase()
  );
  const relatedDestinations = destinations
    .filter((d) => d.id !== destination.id && d.region === destination.region)
    .slice(0, 3);
  const relatedBlogs = blogPosts
    .filter(
      (b) =>
        b.relatedDestinationSlugs.includes(destination.slug) ||
        b.destination.toLowerCase() === destination.name.toLowerCase()
    )
    .slice(0, 3);

  return (
    <div className="pt-16">
      {/* Full-Screen Destination Cover */}
      <section className="relative min-h-[65vh] flex items-end bg-[#102A43]">
        <SafeImage
          src={gallery[activePhoto] || destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/55 to-[#102A43]/25" />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-12 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-2">
            {destination.region} · {destination.country} · {destination.elevationOrClimate}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold">
            {destination.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            {destination.fullIntro}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/packages?q=${encodeURIComponent(destination.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5AD50] text-[#102A43] text-sm font-semibold hover:bg-[#eab964] transition-colors"
            >
              View {destination.availableTours} Tour Packages <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/custom-tour?dest=${encodeURIComponent(destination.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Request Custom Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Interactive 3D Gallery + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-3">
                Overview &amp; Character
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">{destination.overview}</p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#102A43] mb-4">
                Popular Attractions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.attractions.map((att) => (
                  <div key={att.name} className="rounded-xl border border-slate-200 bg-white p-5">
                    <h4 className="font-semibold text-[#102A43] text-sm mb-1">{att.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{att.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#102A43] mb-4">
                Things To Do
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.thingsToDo.map((todo) => (
                  <li key={todo} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#168AAD] shrink-0 mt-0.5" />
                    <span>{todo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Weather, Map Coordinates & Tips */}
          <div className="lg:col-span-5 space-y-6">
            {/* 3D Tilt Photo Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <TiltCard key={idx} maxTilt={6}>
                  <button
                    type="button"
                    onClick={() => setActivePhoto(idx)}
                    className={`w-full aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                      activePhoto === idx ? 'border-[#168AAD] shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt={`${destination.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                </TiltCard>
              ))}
            </div>

            {/* Weather Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#102A43] inline-flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-[#168AAD]" />
                  Seasonal Climate Guide
                </h3>
                <span className="text-xs font-medium text-[#168AAD] inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Best: {destination.bestSeason}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {destination.weather.map((w) => (
                  <div key={w.season} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#102A43]">{w.season}</p>
                      <p className="text-slate-500">{w.condition}</p>
                    </div>
                    <span className="font-mono font-semibold text-[#168AAD] tabular-nums shrink-0">{w.tempRange}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real 3D Google Maps Location Explorer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold inline-flex items-center gap-2 text-sm text-[#102A43]">
                  <MapPin className="w-4 h-4 text-[#168AAD]" />
                  Live 3D Terrain &amp; Exact GPS
                </h3>
                <span className="font-mono text-xs text-[#168AAD] tabular-nums">
                  {destination.coordinates.lat.toFixed(4)}° N, {destination.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
              <Pakistan3DMap
                locations={[destination, ...relatedDestinations]}
                focusedSlug={destination.slug}
                compact
                heightClass="h-64"
              />
            </div>

            {/* Travel Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-[#102A43] mb-3 inline-flex items-center gap-2 text-sm">
                <Mountain className="w-4 h-4 text-[#168AAD]" />
                Director’s Travel Tips
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {destination.travelTips.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Available Packages */}
        {availablePackages.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">
              Available Tours in {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePackages.slice(0, 3).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {destReviews.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">
              Traveler Reviews for {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </div>
        )}

        {/* Related Destinations & Blogs */}
        {relatedDestinations.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">
              Nearby &amp; Related Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDestinations.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        )}

        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">
              Editorial Guides on {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <BlogCard key={b.id} post={b} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
