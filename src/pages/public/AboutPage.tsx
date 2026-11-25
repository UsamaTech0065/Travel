import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCAL_IMAGES } from '../../data/images';
import { SafeImage } from '../../components/common/SafeImage';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { ReviewCard } from '../../components/cards/ReviewCard';

export const AboutPage: React.FC = () => {
  const { reviews, employees, destinations } = useApp();

  return (
    <div className="pt-16">
      <section className="relative h-80 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.fairyMeadows}
          alt="Nanga Parbat & Fairy Meadows Expedition Leadership"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/65 to-[#102A43]/30" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-2">Founded in Islamabad · Operating Since 2014</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Our Story &amp; Mountain Heritage</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Intro + Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43]">
              Crafted Around Pakistan’s Alpine Peaks, Valleys &amp; Coastlines
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Karakoram Voyages began in 2014 with a single 4x4 convoy guiding mountain photographers from Islamabad into Upper Hunza. Today, we operate bespoke journeys across all {destinations.length} curated Pakistani locations—from Hunza, Skardu, and Fairy Meadows to Lahore’s Mughal citadels and Gwadar’s Makran coast.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Every expedition is built on local stewardship: salaried Gilgit-Baltistan guides, vetted heritage hoteliers, transparent pricing, and 24/7 operational oversight.
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <Compass className="w-6 h-6 text-[#168AAD] mb-3" />
              <h3 className="font-serif text-xl font-semibold text-[#102A43] mb-2">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To showcase Northern Pakistan and heritage destinations across the country with uncompromising safety, cultural respect, and effortless comfort.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <Award className="w-6 h-6 text-[#E5AD50] mb-3" />
              <h3 className="font-serif text-xl font-semibold text-[#102A43] mb-2">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be Pakistan’s most trusted luxury expedition brand, elevating sustainable tourism across mountain and coastal communities.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="rounded-2xl bg-[#102A43] text-white p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-[#E5AD50]">
              <AnimatedCounter end={12} suffix="+" />
            </p>
            <p className="text-xs text-slate-300 mt-1">Years Leading Expeditions</p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-[#E5AD50]">
              <AnimatedCounter end={14200} suffix="+" />
            </p>
            <p className="text-xs text-slate-300 mt-1">Happy Guests Hosted</p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-[#E5AD50]">
              <AnimatedCounter end={98} suffix="%" />
            </p>
            <p className="text-xs text-slate-300 mt-1">On-Time Departure Record</p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-[#E5AD50]">
              <AnimatedCounter end={destinations.length} />
            </p>
            <p className="text-xs text-slate-300 mt-1">Curated Pakistan Regions</p>
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-8">
            Meet Our Expedition &amp; Concierge Leadership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.slice(0, 3).map((emp, idx) => (
              <div key={emp.id} className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center gap-4">
                <SafeImage
                  src={idx === 1 ? LOCAL_IMAGES.avatarWoman : LOCAL_IMAGES.avatarMan}
                  alt={emp.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-[#102A43] truncate">{emp.name}</p>
                  <p className="text-xs font-medium text-[#168AAD] truncate">{emp.role}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{emp.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'DTS & PATO Licensed Operator', desc: 'Fully registered with Pakistan Department of Tourist Services and Alpine Club expedition partners.' },
            { icon: Users, title: 'Community Mountain Stewardship', desc: 'Over 80% of our northern expedition crew hail directly from Hunza, Shigar, and Swat.' },
            { icon: Award, title: '99.4% Permit & LOI Clearance', desc: 'Dedicated clearance support for Gilgit-Baltistan trekking permits, AJK NOCs, and inbound e-Visas.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <item.icon className="w-5 h-5 text-[#168AAD] mb-3" />
              <h3 className="font-semibold text-[#102A43] mb-1.5">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#102A43] mb-6">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#102A43]">Ready to Plan Your Next Journey?</h3>
            <p className="text-sm text-slate-600 mt-1">Speak directly with our Islamabad or Gilgit specialists.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/packages" className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]">
              Browse Packages
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-[#102A43]">
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
