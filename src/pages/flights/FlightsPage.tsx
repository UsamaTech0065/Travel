import React, { useMemo, useState } from 'react';
import { ArrowRight, Luggage, Plane, Plus, Trash2 } from 'lucide-react';
import { MOCK_FLIGHTS } from '../../data/hotelsFlightsVisa';
import { FlightResult } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../../components/common/SafeImage';
import { LOCAL_IMAGES } from '../../data/images';

export const FlightsPage: React.FC = () => {
  const { showToast } = useApp();

  const [tripType, setTripType] = useState<'Round Trip' | 'One-Way' | 'Multi-City'>('Round Trip');
  const [fromCity, setFromCity] = useState('Islamabad');
  const [toCity, setToCity] = useState('All');
  const [departDate, setDepartDate] = useState('2027-05-12');
  const [returnDate, setReturnDate] = useState('2027-05-19');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('All');
  const [multiLegs, setMultiLegs] = useState([
    { from: 'Islamabad', to: 'Gilgit', date: '2027-05-12' },
    { from: 'Karachi', to: 'Skardu', date: '2027-05-20' },
  ]);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);

  const results = useMemo(() => {
    return MOCK_FLIGHTS.filter((f) => {
      if (fromCity !== 'All' && f.fromCity.toLowerCase() !== fromCity.toLowerCase()) return false;
      if (toCity !== 'All' && f.toCity.toLowerCase() !== toCity.toLowerCase()) return false;
      if (cabinClass !== 'All' && f.cabinClass !== cabinClass) return false;
      return true;
    });
  }, [fromCity, toCity, cabinClass]);

  const handleBookFlight = (flight: FlightResult) => {
    setSelectedFlight(flight);
    showToast(
      `Itinerary Hold: ${flight.flightNumber}`,
      `${flight.fromCode} → ${flight.toCode} for ${passengers} passenger(s) added to your travel inquiry.`
    );
  };

  return (
    <div className="pt-16">
      <section className="relative h-64 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.skardu}
          alt="Pakistan Domestic & Mountain Aviation Connections"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/70 to-[#102A43]/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-1.5">Domestic Mountain Sectors &amp; Inter-City Pakistan Aviation</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Domestic Flight Explorer</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Search Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {(['Round Trip', 'One-Way', 'Multi-City'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTripType(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    tripType === t ? 'bg-white text-[#102A43] shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Sample reference schedules &amp; indicative fares for itinerary planning
            </p>
          </div>

          {tripType === 'Multi-City' ? (
            <div className="space-y-3">
              {multiLegs.map((leg, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <input
                    type="text"
                    value={leg.from}
                    onChange={(e) => {
                      const next = [...multiLegs];
                      next[i].from = e.target.value;
                      setMultiLegs(next);
                    }}
                    placeholder="From city"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    value={leg.to}
                    onChange={(e) => {
                      const next = [...multiLegs];
                      next[i].to = e.target.value;
                      setMultiLegs(next);
                    }}
                    placeholder="To city"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />
                  <input
                    type="date"
                    value={leg.date}
                    onChange={(e) => {
                      const next = [...multiLegs];
                      next[i].date = e.target.value;
                      setMultiLegs(next);
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                  />
                  {multiLegs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setMultiLegs((prev) => prev.filter((_, idx) => idx !== i))}
                      className="inline-flex items-center gap-1 text-xs text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMultiLegs((prev) => [...prev, { from: 'Karachi', to: 'Gwadar', date: '2027-05-25' }])}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#168AAD]"
              >
                <Plus className="w-3.5 h-3.5" /> Add Flight Segment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Departure City</label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <option value="All">Any Origin</option>
                  <option value="Islamabad">Islamabad (ISB)</option>
                  <option value="Lahore">Lahore (LHE)</option>
                  <option value="Karachi">Karachi (KHI)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Arrival City</label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <option value="All">All Domestic Airports</option>
                  <option value="Gilgit">Gilgit (GIL)</option>
                  <option value="Skardu">Skardu (KDU)</option>
                  <option value="Chitral">Chitral (CJL)</option>
                  <option value="Islamabad">Islamabad (ISB)</option>
                  <option value="Lahore">Lahore (LHE)</option>
                  <option value="Gwadar">Gwadar (GWD)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Departure</label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                />
              </div>
              {tripType === 'Round Trip' && (
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((p) => (
                    <option key={p} value={p}>{p} {p === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <option value="All">All Cabins</option>
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{results.length} indicative schedules shown for {departDate}</span>
            {selectedFlight && (
              <span className="font-semibold text-emerald-700">
                Selected: {selectedFlight.flightNumber} ({selectedFlight.fromCode} → {selectedFlight.toCode})
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="font-serif text-xl text-[#102A43]">No sample flights match that route filter</p>
              <button
                type="button"
                onClick={() => {
                  setFromCity('All');
                  setToCity('All');
                  setCabinClass('All');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold"
              >
                Show All Sample Routes
              </button>
            </div>
          ) : (
            results.map((f) => {
              const totalFare = f.price * passengers * (tripType === 'Round Trip' ? 1.85 : 1);
              return (
                <div
                  key={f.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4 min-w-[210px]">
                    <div className="w-11 h-11 rounded-xl bg-[#102A43]/5 flex items-center justify-center font-mono text-xs font-bold text-[#102A43]">
                      {f.airlineCode}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#102A43]">{f.airline}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {f.flightNumber} · {f.cabinClass}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-[#102A43] tabular-nums">{f.departureTime}</p>
                      <p className="text-xs text-slate-500">{f.fromCity} ({f.fromCode})</p>
                    </div>

                    <div className="flex flex-col items-center min-w-[120px]">
                      <span className="text-[11px] font-mono text-slate-500">{f.duration}</span>
                      <div className="w-full flex items-center gap-1.5 my-1">
                        <div className="h-px flex-1 bg-slate-300" />
                        <Plane className="w-3.5 h-3.5 text-[#168AAD]" />
                        <div className="h-px flex-1 bg-slate-300" />
                      </div>
                      <span className="text-[11px] font-medium text-[#168AAD]">
                        {f.stops === 0 ? 'Nonstop' : `${f.stops} Stop (${f.stopCity})`}
                      </span>
                    </div>

                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-[#102A43] tabular-nums">{f.arrivalTime}</p>
                      <p className="text-xs text-slate-500">{f.toCity} ({f.toCode})</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-slate-400" /> {f.baggage}
                      </p>
                      <p className="font-mono text-xl font-bold text-[#102A43] tabular-nums mt-0.5">
                        {formatCurrency(Math.round(totalFare))}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookFlight(f)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] transition-colors whitespace-nowrap"
                    >
                      Request Ticket <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
