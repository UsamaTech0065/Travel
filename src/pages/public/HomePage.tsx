import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  ArrowRight,
  Calendar,
  Check,
  Compass,
  Copy,
  MapPin,
  Plane,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCAL_IMAGES } from '../../data/images';
import { formatCurrency, formatDate } from '../../utils/format';
import { SafeImage } from '../../components/common/SafeImage';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { DestinationCard } from '../../components/cards/DestinationCard';
import { PackageCard } from '../../components/cards/PackageCard';
import { BlogCard } from '../../components/cards/BlogCard';
import { ReviewCard } from '../../components/cards/ReviewCard';
import { Pakistan3DMap } from '../../components/maps/Pakistan3DMap';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const { destinations, packages, reviews, blogPosts, siteSettings, subscribeNewsletter, showToast } = useApp();
  const navigate = useNavigate();

  // Hero search state
  const [searchDest, setSearchDest] = useState('');
  const [travelDate, setTravelDate] = useState('2027-05-15');
  const [travelers, setTravelers] = useState('2');

  // Pakistan section tab
  const [pakistanTab, setPakistanTab] = useState<'Northern Pakistan' | 'Pakistan Heritage & Coast'>('Northern Pakistan');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const heroPlaneRef = useRef<SVGSVGElement | null>(null);
  const revealContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (heroPlaneRef.current) {
        gsap.to(heroPlaneRef.current, {
          x: 28,
          y: -10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, revealContainerRef);

    return () => ctx.revert();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDest.trim()) params.set('q', searchDest.trim());
    if (travelDate) params.set('date', travelDate);
    if (travelers) params.set('guests', travelers);
    navigate(`/packages?${params.toString()}`);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('HUNZA15').catch(() => {});
    setCopiedCode(true);
    showToast('Promo code HUNZA15 copied', 'Apply at checkout for 15% seasonal savings.');
    window.setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    subscribeNewsletter(newsletterEmail.trim());
    setNewsletterEmail('');
  };

  const pakistanDestinations = destinations
    .filter((d) => d.region === pakistanTab)
    .slice(0, 8);
  const coastalHeritageDestinations = destinations
    .filter((d) => d.region === 'Pakistan Heritage & Coast')
    .slice(0, 4);
  const trendingPackages = packages.filter((p) => p.trending || p.featured).slice(0, 6);
  const upcomingDepartures = packages.slice(0, 4);
  const approvedReviews = reviews.filter((r) => r.status === 'Approved');
  const latestBlogs = blogPosts.slice(0, 3);

  const galleryFrames = [
    { src: LOCAL_IMAGES.heroHunza, label: 'Hunza Valley Terraces' },
    { src: LOCAL_IMAGES.skardu, label: 'Lower Kachura, Skardu' },
    { src: LOCAL_IMAGES.fairyMeadows, label: 'Nanga Parbat & Fairy Meadows' },
    { src: LOCAL_IMAGES.attabadPassu, label: 'Attabad Fjord & Passu Cones' },
    { src: LOCAL_IMAGES.lahore, label: 'Badshahi Mosque, Lahore' },
    { src: LOCAL_IMAGES.gwadarHingol, label: 'Makran Coast & Gwadar Cliffs' },
  ];

  return (
    <div ref={revealContainerRef} className="overflow-x-clip">
      {/* 1. Full-Screen Hero Section */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 bg-[#102A43]">
        <div className="absolute inset-0 overflow-hidden">
          <SafeImage
            src={LOCAL_IMAGES.heroHunza}
            alt="Golden hour over Hunza Valley and Rakaposhi peak in Northern Pakistan"
            className="w-full h-full object-cover scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/60 to-[#102A43]/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#E5AD50] mb-4">
              Northern Peaks · Alpine Valleys · Mughal Heritage · Makran Coast
            </p>
            <h1
              className="font-serif text-white font-semibold tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(2.35rem, 4.8vw, 4.1rem)' }}
            >
              {siteSettings.heroHeadline}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              From the apricot-terraced cliffs of Hunza and turquoise alpine lakes of Skardu to Lahore’s Mughal citadels and Gwadar’s coastal bluffs—travel privately or in small director-led groups across Pakistan.
            </p>
          </motion.div>

          {/* Interactive Travel Search Widget */}
          <motion.form
            onSubmit={handleHeroSearch}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mt-10 rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl border border-white/40 max-w-5xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
              <div>
                <label htmlFor="hero-dest" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Destination in Pakistan
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#168AAD] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="hero-dest"
                    type="text"
                    value={searchDest}
                    onChange={(e) => setSearchDest(e.target.value)}
                    placeholder="Hunza, Skardu, Swat, Gwadar..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-[#102A43] focus:bg-white focus:border-[#168AAD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hero-date" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Preferred Departure
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#168AAD] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="hero-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-[#102A43] tabular-nums focus:bg-white focus:border-[#168AAD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hero-guests" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Travelers
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-[#168AAD] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="hero-guests"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-[#102A43] focus:bg-white focus:border-[#168AAD] focus:outline-none"
                  >
                    <option value="1">1 Solo Traveler</option>
                    <option value="2">2 Travelers</option>
                    <option value="4">4 Travelers (Family)</option>
                    <option value="6">6+ Private Group</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A43] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#168AAD] transition-colors h-[42px]"
              >
                <Search className="w-4 h-4" />
                Search Journeys
              </button>
            </div>
          </motion.form>

          {/* Compact Trust Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl text-white/90">
            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-[#E5AD50]">
                <AnimatedCounter end={destinations.length} />
              </p>
              <p className="text-xs text-slate-300 mt-0.5">Curated Pakistan Destinations</p>
            </div>
            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-[#E5AD50]">
                <AnimatedCounter end={14200} suffix="+" />
              </p>
              <p className="text-xs text-slate-300 mt-0.5">Travelers Guided Safely</p>
            </div>
            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-[#E5AD50]">4.9 / 5</p>
              <p className="text-xs text-slate-300 mt-0.5">Verified Expedition Rating</p>
            </div>
            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-[#E5AD50]">24/7</p>
              <p className="text-xs text-slate-300 mt-0.5">Islamabad &amp; Gilgit Concierge</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Pakistan Section */}
      <section className="gsap-reveal py-16 lg:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#168AAD] mb-2">Signature Homeland Collection</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#102A43]">
                Explore the Untamed Beauty of Pakistan
              </h2>
              <p className="mt-2.5 text-slate-600 max-w-2xl text-sm sm:text-base">
                Twenty-four hand-curated regions spanning the high Karakoram passes, Kashmir valleys, Mughal citadels, and the Makran coastline.
              </p>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/70 self-start">
              <button
                type="button"
                onClick={() => setPakistanTab('Northern Pakistan')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  pakistanTab === 'Northern Pakistan'
                    ? 'bg-white text-[#102A43] shadow-sm'
                    : 'text-slate-600 hover:text-[#102A43]'
                }`}
              >
                Northern Valleys
              </button>
              <button
                type="button"
                onClick={() => setPakistanTab('Pakistan Heritage & Coast')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  pakistanTab === 'Pakistan Heritage & Coast'
                    ? 'bg-white text-[#102A43] shadow-sm'
                    : 'text-slate-600 hover:text-[#102A43]'
                }`}
              >
                Heritage &amp; Coast
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pakistanDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#102A43] text-sm font-semibold text-[#102A43] hover:bg-[#102A43] hover:text-white transition-colors"
            >
              Browse All {destinations.length} Pakistan Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Trending Tour Packages Carousel (Swiper.js) */}
      <section className="gsap-reveal py-16 lg:py-24 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#168AAD] mb-2">Most Requested Itineraries</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#102A43]">
                Trending Tour Packages
              </h2>
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#102A43] hover:text-[#168AAD] whitespace-nowrap"
            >
              All {packages.length} Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5500, disableOnInteraction: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {trendingPackages.map((pkg) => (
              <SwiperSlide key={pkg.id} className="h-auto">
                <PackageCard pkg={pkg} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 4. Special Travel Offer Banner + Why Choose Us / Animated Flight Path */}
      <section className="gsap-reveal py-16 lg:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Special Offer */}
          <div className="relative overflow-hidden rounded-2xl bg-[#102A43] text-white p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#E5AD50] mb-2">Limited Seasonal Privilege</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
                Save 15% on Early-Bird Hunza Blossom &amp; Skardu Summer Departures
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Reserve with just a 30% deposit and enjoy complimentary Islamabad airport pickup plus flexible date changes up to 7 days before departure.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5AD50]/60 bg-white/10 px-4 py-3 font-mono text-sm font-semibold text-[#E5AD50] hover:bg-white/15 transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                HUNZA15
              </button>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E5AD50] px-6 py-3 text-sm font-semibold text-[#102A43] hover:bg-[#eab964] transition-colors whitespace-nowrap"
              >
                Claim Offer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Why Choose Us + Experiences */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <Plane ref={heroPlaneRef} className="w-6 h-6 text-[#168AAD]" />
                <span className="text-xs font-semibold text-[#168AAD]">The Karakoram Voyages Standard</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#102A43]">
                Crafted by Mountain Directors, Built for Pakistan Terrain
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                From high-altitude Karakoram passes in Gilgit-Baltistan to Swat’s cedar valleys and coastal expeditions in Balochistan, every itinerary is operated directly by our salaried field teams—never outsourced blindly.
              </p>
              <Link
                to="/custom-tour"
                className="inline-flex items-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#168AAD] transition-colors"
              >
                Design a Custom Itinerary <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Shield,
                  title: '01. Flight & Weather Contingency',
                  desc: 'Gilgit, Skardu, and Chitral flights include guaranteed luxury 4x4 overland backup via KKH or Babusar so your itinerary never stalls.',
                },
                {
                  icon: Compass,
                  title: '02. Curated Boutique Stays',
                  desc: 'Direct partnerships with Shigar Fort, Serena Karimabad, Attabad cliff suites, and heritage lodges nationwide.',
                },
                {
                  icon: Sparkles,
                  title: '03. Permits, NOCs & E-Visa Desk',
                  desc: 'Dedicated permit desk handling Pakistan Tourist E-Visa LOIs, Gilgit-Baltistan permits, Azad Kashmir NOCs, and coastal passes.',
                },
                {
                  icon: Users,
                  title: '04. Small-Group & Private Pace',
                  desc: 'Maximum 12 travelers on group expeditions, or completely bespoke private Prado & Coaster fleets for families.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <item.icon className="w-5 h-5 text-[#168AAD] mb-3" />
                  <h3 className="text-base font-semibold text-[#102A43] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real 3D Terrain Map of Pakistan Section */}
      <section className="gsap-reveal py-16 lg:py-24 bg-[#102A43] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#E5AD50] mb-2">Google Maps Photorealistic 3D Explorer</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                Explore Exact Locations in Real 3D Across Pakistan
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md">
              Fly directly into peaks, valleys, and coastal landmarks managed by our team. Click any 3D terrain pin to inspect its photo gallery, elevation, GPS coordinates, and tours.
            </p>
          </div>

          <Pakistan3DMap />
        </div>
      </section>

      {/* 6. Heritage & Coastal Pakistan + Upcoming Group Tours */}
      <section className="gsap-reveal py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Heritage, Coast & Desert */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-[#168AAD] mb-2">Southern &amp; Heartland Pakistan</p>
                <h2 className="font-serif text-3xl font-semibold text-[#102A43]">
                  Heritage Citadels, Deserts &amp; Makran Coast
                </h2>
              </div>
              <Link
                to="/destinations?region=Pakistan+Heritage+%26+Coast"
                className="text-sm font-semibold text-[#102A43] hover:text-[#168AAD] whitespace-nowrap"
              >
                All Heritage &amp; Coast →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coastalHeritageDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>

          {/* Upcoming Group Tours */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-[#168AAD] mb-2">Guaranteed Small-Group Dates</p>
                <h2 className="font-serif text-3xl font-semibold text-[#102A43]">
                  Upcoming Group Departures
                </h2>
              </div>
              <Link to="/packages" className="text-sm font-semibold text-[#102A43] hover:text-[#168AAD] whitespace-nowrap">
                View Calendar →
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                    <th className="py-3.5 px-5">Expedition</th>
                    <th className="py-3.5 px-5">Destination</th>
                    <th className="py-3.5 px-5">Next Departure</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5 text-right">Seats Left</th>
                    <th className="py-3.5 px-5 text-right">Price</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {upcomingDepartures.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-semibold text-[#102A43]">
                        <Link to={`/packages/${pkg.slug}`} className="hover:text-[#168AAD]">
                          {pkg.title}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-slate-600">{pkg.destinationName}</td>
                      <td className="py-4 px-5 text-slate-600 font-mono text-xs tabular-nums">
                        {formatDate(pkg.departureDates[0])}
                      </td>
                      <td className="py-4 px-5 text-slate-600">{pkg.durationLabel}</td>
                      <td className="py-4 px-5 text-right font-mono tabular-nums text-emerald-700 font-medium">
                        {pkg.availableSeats} open
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-[#102A43] tabular-nums">
                        {formatCurrency(pkg.price)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/booking?package=${pkg.id}`}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] transition-colors whitespace-nowrap"
                        >
                          Reserve Seat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials & Review Stats */}
      <section className="gsap-reveal py-16 lg:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#168AAD] mb-2">Verified Guest Stories</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#102A43]">
                Trusted by Explorers Across Pakistan
              </h2>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="font-mono text-2xl font-bold text-[#102A43] tabular-nums inline-flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-[#E5AD50] text-[#E5AD50]" />
                  4.9 / 5.0
                </p>
                <p className="text-xs text-slate-500">Across {approvedReviews.length * 140}+ verified departures</p>
              </div>
              <Link to="/reviews" className="text-sm font-semibold text-[#168AAD] hover:underline whitespace-nowrap">
                Read All Reviews →
              </Link>
            </div>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {approvedReviews.map((rev) => (
              <SwiperSlide key={rev.id} className="h-auto">
                <ReviewCard review={rev} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 8. Latest Travel Blogs & Editorial Gallery */}
      <section className="gsap-reveal py-16 lg:py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Blogs */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-[#168AAD] mb-2">The Karakoram Journal</p>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#102A43]">
                  Field Guides &amp; Travel Stories
                </h2>
              </div>
              <Link to="/blog" className="text-sm font-semibold text-[#102A43] hover:text-[#168AAD] whitespace-nowrap">
                All {blogPosts.length} Guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Visual Social Gallery */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-[#168AAD] mb-1">Field Photography</p>
                <h3 className="font-serif text-2xl font-semibold text-[#102A43]">
                  Captured Along the Silk Road &amp; Beyond
                </h3>
              </div>
              <span className="text-xs text-slate-500">@karakoramvoyages</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {galleryFrames.map((frame) => (
                <div key={frame.label} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                  <SafeImage
                    src={frame.src}
                    alt={frame.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] font-medium text-white truncate">{frame.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Strip */}
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-serif text-2xl font-semibold text-[#102A43]">
                Receive Seasonal Pass Openings &amp; Private Departure Alerts
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                One curated dispatch per month—featuring blossom forecasts, Deosai road openings, and early-bird allocations.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full lg:w-auto gap-2.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@domain.com"
                className="flex-1 lg:w-72 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#102A43] focus:border-[#168AAD] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors whitespace-nowrap"
              >
                Join Dispatch
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
