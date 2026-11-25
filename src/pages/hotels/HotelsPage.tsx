import React, { useMemo, useState } from 'react';
import { Building2, Check, Star, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotel, HotelRoom } from '../../types';
import { formatCurrency } from '../../utils/format';
import { SafeImage } from '../../components/common/SafeImage';
import { LOCAL_IMAGES } from '../../data/images';

export const HotelsPage: React.FC = () => {
  const { hotels, showToast } = useApp();

  const [destQuery, setDestQuery] = useState('');
  const [checkIn, setCheckIn] = useState('2027-05-12');
  const [checkOut, setCheckOut] = useState('2027-05-16');
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState('All');
  const [maxRate, setMaxRate] = useState(600);
  const [minRating, setMinRating] = useState(0);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);

  const categories = ['All', '5-Star Resort', 'Boutique Heritage', 'Alpine Lodge', 'City Luxury'];

  const filtered = useMemo(() => {
    const q = destQuery.trim().toLowerCase();
    return hotels.filter((h) => {
      if (category !== 'All' && h.category !== category) return false;
      if (h.pricePerNight > maxRate) return false;
      if (h.rating < minRating) return false;
      if (q && !h.destination.toLowerCase().includes(q) && !h.name.toLowerCase().includes(q) && !h.country.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [hotels, destQuery, category, maxRate, minRating]);

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 3
  );

  const handleReserveRoom = (hotel: Hotel, room: HotelRoom) => {
    showToast(
      `Room Held at ${hotel.name}`,
      `${room.name} for ${nights} nights (${formatCurrency(room.pricePerNight * nights)}) confirmed in concierge queue.`
    );
    setSelectedHotel(null);
    setSelectedRoom(null);
  };

  return (
    <div className="pt-16">
      <section className="relative h-72 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.luxuryHotel}
          alt="Luxury Mountain Resort in Hunza"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/65 to-[#102A43]/30" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-2">Handpicked Alpine &amp; Heritage Stays</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Curated Hotels &amp; Mountain Resorts</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Search & Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              placeholder="City or property (Hunza, Skardu, Lahore, Gwadar...)"
              className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm"
            />
            <input
              type="date"
              aria-label="Check-in date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
            />
            <input
              type="date"
              aria-label="Check-out date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
            />
            <select
              aria-label="Guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              {[1, 2, 3, 4, 6].map((g) => (
                <option key={g} value={g}>{g} {g === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat ? 'bg-[#102A43] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs">
              <label className="flex items-center gap-2 font-medium text-[#102A43]">
                Max Rate: <span className="font-mono text-[#168AAD] tabular-nums">{formatCurrency(maxRate)}/nt</span>
                <input
                  type="range"
                  min={150}
                  max={600}
                  step={25}
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
                  className="accent-[#168AAD]"
                />
              </label>

              <select
                aria-label="Minimum rating"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-[#102A43]"
              >
                <option value={0}>All Ratings</option>
                <option value={4.8}>4.8+ Stars</option>
                <option value={4.9}>4.9+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel) => (
            <article key={hotel.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <SafeImage
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#168AAD]">
                      {hotel.destination}, {hotel.country} · {hotel.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#102A43] tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-[#E5AD50] text-[#E5AD50]" />
                      {hotel.rating.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-[#102A43]">{hotel.name}</h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{hotel.description}</p>
                  <p className="mt-3 text-xs text-slate-500 truncate">
                    {hotel.facilities.slice(0, 3).join(' · ')}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-lg font-bold text-[#102A43] tabular-nums">
                      {formatCurrency(hotel.pricePerNight)}
                    </span>
                    <span className="text-xs text-slate-500"> / night</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setSelectedRoom(hotel.rooms[0] || null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] transition-colors"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Hotel Detail & Room Selection Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#168AAD]">
                  {selectedHotel.destination}, {selectedHotel.country} · {selectedHotel.category}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43]">
                  {selectedHotel.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotel(null)}
                aria-label="Close hotel modal"
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedHotel.gallery.slice(0, 2).map((img, i) => (
                <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                  <SafeImage src={img} alt={selectedHotel.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{selectedHotel.description}</p>

            <div>
              <h3 className="text-xs font-semibold text-[#102A43] mb-2">Included Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                {selectedHotel.facilities.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#102A43]">
                Available Suites ({nights} nights · {guests} guests)
              </h3>
              {selectedHotel.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`rounded-xl border p-4 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedRoom?.id === room.id ? 'border-[#168AAD] bg-[#168AAD]/5' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm text-[#102A43] inline-flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#168AAD]" /> {room.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {room.bedType} · {room.sizeSqm} m² · Up to {room.capacity} guests
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{room.amenities.join(' · ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-lg font-bold text-[#102A43] tabular-nums">
                      {formatCurrency(room.pricePerNight * nights)}
                    </p>
                    <p className="text-[11px] text-slate-500">{formatCurrency(room.pricePerNight)} / night</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedRoom && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedHotel(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReserveRoom(selectedHotel, selectedRoom)}
                  className="px-6 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
                >
                  Reserve {selectedRoom.name} ({formatCurrency(selectedRoom.pricePerNight * nights)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
