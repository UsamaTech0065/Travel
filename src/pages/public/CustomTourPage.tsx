import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';

const ACTIVITIES = [
  'Glacier Trekking & Mountain Hikes',
  'Mughal Heritage & Architectural Walks',
  'Private Boat Charters',
  'Luxury Camping & Stargazing',
  'Culinary & Cultural Immersions',
  'Photography & Wildlife Safaris',
];

export const CustomTourPage: React.FC = () => {
  const { destinations, showToast } = useApp();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [preferredDest, setPreferredDest] = useState(searchParams.get('dest') || 'Hunza Valley & Skardu');
  const [departureDate, setDepartureDate] = useState('2027-06-10');
  const [returnDate, setReturnDate] = useState('2027-06-18');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budgetPerPerson, setBudgetPerPerson] = useState(1800);
  const [hotelPref, setHotelPref] = useState('5-Star Luxury & Heritage Palaces');
  const [transportPref, setTransportPref] = useState('Private 4x4 Land Cruiser + Domestic Flights');
  const [travelStyle, setTravelStyle] = useState('Balanced Luxury & Scenic Exploration');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Glacier Trekking & Mountain Hikes',
    'Culinary & Cultural Immersions',
  ]);
  const [notes, setNotes] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const toggleActivity = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.includes('@')) return;
    showToast('Custom Proposal Requested', 'A senior route director will contact you within 12 hours.');
    setStep(4);
  };

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#168AAD] mb-1">Bespoke Expedition Architect</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43]">
            Design Your Private Journey
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tailor every valley, suite tier, flight sector, and pace to your group’s preferences.
          </p>
        </div>

        {/* Stepper */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 mb-8">
            {['1. Route & Dates', '2. Style & Comfort', '3. Contact Details'].map((label, idx) => (
              <div
                key={label}
                className={`rounded-xl border px-4 py-2.5 text-xs font-semibold ${
                  step === idx + 1
                    ? 'bg-[#102A43] border-[#102A43] text-white'
                    : step > idx + 1
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Preferred Destination(s)
                </label>
                <input
                  type="text"
                  list="dest-suggestions"
                  value={preferredDest}
                  onChange={(e) => setPreferredDest(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                />
                <datalist id="dest-suggestions">
                  {destinations.map((d) => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Adults</label>
                  <input
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Children</label>
                  <input
                    type="number"
                    min={0}
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Target Budget / Person ({formatCurrency(budgetPerPerson)})
                  </label>
                  <input
                    type="range"
                    min={600}
                    max={6000}
                    step={100}
                    value={budgetPerPerson}
                    onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                    className="w-full accent-[#168AAD] mt-2"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Hotel Tier</label>
                  <select
                    value={hotelPref}
                    onChange={(e) => setHotelPref(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm"
                  >
                    <option>5-Star Luxury &amp; Heritage Palaces</option>
                    <option>4-Star Boutique Alpine Lodges</option>
                    <option>Comfortable Family Cottages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Transport Preference</label>
                  <select
                    value={transportPref}
                    onChange={(e) => setTransportPref(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm"
                  >
                    <option>Private 4x4 Land Cruiser + Domestic Flights</option>
                    <option>Private Luxury SUV Overland</option>
                    <option>Executive Van / Coaster for Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm"
                >
                  <option>Balanced Luxury &amp; Scenic Exploration</option>
                  <option>Honeymoon &amp; Romantic Seclusion</option>
                  <option>Active Mountain Trekking &amp; Photography</option>
                  <option>Multi-Generational Family Pace</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#102A43] mb-2">Desired Experiences</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ACTIVITIES.map((act) => {
                    const active = selectedActivities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleActivity(act)}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium text-left transition-colors ${
                          active
                            ? 'border-[#168AAD] bg-[#168AAD]/10 text-[#102A43]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#168AAD]' : 'opacity-20'}`} />
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Additional Notes or Special Celebrations
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anniversary dinner in Karimabad, halal gourmet meals, child car seat..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Email Address</label>
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
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-[#102A43]">Proposal Summary</p>
                <p>Route: {preferredDest} ({departureDate} to {returnDate})</p>
                <p>Party: {adults} Adults, {children} Children · {hotelPref}</p>
                <p>Target Budget: {formatCurrency(budgetPerPerson)} / person</p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#E5AD50] text-[#102A43] text-sm font-bold hover:bg-[#eab964]"
                >
                  Submit Custom Request
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-3xl font-semibold text-[#102A43]">
                Custom Proposal Request Received
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, {fullName}. Our senior Karakoram &amp; Pakistan route directors are crafting a tailored day-by-day itinerary for <strong>{preferredDest}</strong> and will email {email} within 12 hours.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <Link to="/packages" className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
                  Explore Ready Packages
                </Link>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#102A43]"
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
