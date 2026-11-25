import React, { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../../components/common/SafeImage';
import { LOCAL_IMAGES } from '../../data/images';
import { FAQ_CATEGORIES } from '../../data/reviewsAndAdmin';
import { Pakistan3DMap } from '../../components/maps/Pakistan3DMap';

export const ContactPage: React.FC = () => {
  const { siteSettings, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tour Package Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) return;
    setSent(true);
    showToast('Message delivered', 'Our Islamabad concierge team will respond within 4 business hours.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="pt-16">
      <section className="relative h-64 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.lahore}
          alt="Karakoram Voyages Concierge"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/70 to-[#102A43]/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-1.5">Islamabad · Lahore · Karimabad</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Contact Our Travel Concierge</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details + Map UI */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[#102A43]">Headquarters &amp; Desks</h2>
              <div className="space-y-3.5 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#168AAD] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#102A43]">Islamabad Flagship Office</p>
                    <p>Suite 14, Kohsar Arcade, Sector F-6/3, Islamabad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#168AAD] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#102A43]">Direct Desk</p>
                    <p className="tabular-nums">{siteSettings.supportPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#102A43]">WhatsApp Concierge (24/7)</p>
                    <p className="tabular-nums">+92 300 844 2910</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#168AAD] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#102A43]">Email</p>
                    <p>{siteSettings.supportEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#168AAD] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#102A43]">Office Hours</p>
                    <p>Mon – Sat: 9:00 AM – 8:00 PM PKT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 3D Map Location Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-[#168AAD]">Headquarters on 3D Terrain Map</p>
                <p className="font-serif text-lg text-[#102A43]">F-6 Markaz, Islamabad · 33.7294° N, 73.0772° E</p>
                <p className="text-xs text-slate-500">
                  18 minutes from Serena Hotel Islamabad · 35 minutes from Islamabad Airport (ISB).
                </p>
              </div>
              <Pakistan3DMap focusedSlug="islamabad" compact heightClass="h-56" />
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#102A43]">Send an Inquiry</h2>
            {sent && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
                Thank you for reaching out. Your inquiry has been logged with our Islamabad travel directors.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Inquiry Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              >
                <option>Tour Package Inquiry</option>
                <option>Custom Private Expedition</option>
                <option>Permits, NOCs &amp; E-Visa LOI</option>
                <option>Corporate &amp; Group Charter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your preferred travel dates, destinations, and group size..."
                className="w-full rounded-xl border border-slate-200 p-3.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Quick FAQs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#102A43] mb-4">Quick Answers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_CATEGORIES.slice(0, 2).flatMap((cat) => cat.items).map((item) => (
              <div key={item.q}>
                <h3 className="text-sm font-semibold text-[#102A43]">{item.q}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
