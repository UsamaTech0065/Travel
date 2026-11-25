import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Download, Plus, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { PackageCard } from '../../components/cards/PackageCard';
import { ReviewCard } from '../../components/cards/ReviewCard';

export const CustomerOverview: React.FC = () => {
  const { user, bookings, wishlist, notifications } = useApp();
  const upcoming = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#102A43]">
          Welcome back, {user?.name || 'Traveler'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Here is a live summary of your upcoming expeditions, documents, and saved trips.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Active Bookings</p>
          <p className="font-mono text-2xl font-bold text-[#102A43] mt-1 tabular-nums">{upcoming.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Trips Logged</p>
          <p className="font-mono text-2xl font-bold text-[#102A43] mt-1 tabular-nums">{bookings.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Saved Wishlist</p>
          <p className="font-mono text-2xl font-bold text-[#168AAD] mt-1 tabular-nums">{wishlist.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Unread Alerts</p>
          <p className="font-mono text-2xl font-bold text-[#E5AD50] mt-1 tabular-nums">
            {notifications.filter((n) => !n.read).length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-[#102A43]">Recent Reservations</h2>
          <Link to="/dashboard/bookings" className="text-xs font-semibold text-[#168AAD] hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-2.5 pr-4">Reference</th>
                <th className="py-2.5 pr-4">Package</th>
                <th className="py-2.5 pr-4">Departure</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 4).map((b) => (
                <tr key={b.id}>
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-[#102A43]">
                    <Link to={`/dashboard/bookings/${b.id}`} className="hover:text-[#168AAD]">
                      {b.reference}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-medium text-[#102A43]">{b.packageTitle}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500 font-mono tabular-nums">{formatDate(b.departureDate)}</td>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#168AAD]">{b.status}</td>
                  <td className="py-3 text-right font-mono font-semibold tabular-nums">{formatCurrency(b.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile({ name, phone, city, country });
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 max-w-2xl"
    >
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">My Traveler Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Email</label>
          <input value={user?.email || ''} disabled className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
      </div>
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]">
        Save Profile Changes
      </button>
    </form>
  );
};

export const CustomerBookingsPage: React.FC = () => {
  const { bookings } = useApp();
  const [filter, setFilter] = useState('All');
  const filtered = bookings.filter((b) => filter === 'All' || b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">My Bookings</h1>
        <div className="flex gap-1.5">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === s ? 'bg-[#102A43] text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">No bookings with status "{filter}".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold text-[#168AAD]">
                  {b.reference} · {b.status}
                </p>
                <h2 className="font-serif text-xl font-semibold text-[#102A43] mt-0.5">{b.packageTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Departure: {formatDate(b.departureDate)} · {b.adults} Adults, {b.children} Children · {b.roomType}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-[#102A43] tabular-nums">{formatCurrency(b.totalAmount)}</p>
                  <p className="text-xs text-emerald-700 tabular-nums">Paid: {formatCurrency(b.paidAmount)}</p>
                </div>
                <Link
                  to={`/dashboard/bookings/${b.id}`}
                  className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD] whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomerBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useApp();
  const booking = bookings.find((b) => b.id === id) || bookings[0];

  if (!booking) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <button type="button" onClick={() => navigate('/dashboard/bookings')} className="text-xs font-semibold text-[#168AAD]">
        ← Back to My Bookings
      </button>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="font-mono text-xs font-semibold text-[#168AAD]">Reference {booking.reference}</p>
            <h1 className="font-serif text-2xl font-semibold text-[#102A43] mt-1">{booking.packageTitle}</h1>
          </div>
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-[#102A43]">
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div><p className="text-xs text-slate-500">Departure</p><p className="font-semibold">{formatDate(booking.departureDate)}</p></div>
          <div><p className="text-xs text-slate-500">Room Tier</p><p className="font-semibold">{booking.roomType}</p></div>
          <div><p className="text-xs text-slate-500">Lead Guest</p><p className="font-semibold">{booking.customerName}</p></div>
          <div><p className="text-xs text-slate-500">Payment Method</p><p className="font-semibold">{booking.paymentMethod}</p></div>
          <div><p className="text-xs text-slate-500">Total Amount</p><p className="font-mono font-bold">{formatCurrency(booking.totalAmount)}</p></div>
          <div><p className="text-xs text-slate-500">Paid</p><p className="font-mono font-bold text-emerald-700">{formatCurrency(booking.paidAmount)}</p></div>
        </div>

        {booking.status !== 'Cancelled' && booking.status !== 'Refund Requested' && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateBookingStatus(booking.id, 'Refund Requested')}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50"
            >
              Request Cancellation / Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerPaymentsPage: React.FC = () => {
  const { bookings } = useApp();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="py-2.5 pr-4">Date</th>
              <th className="py-2.5 pr-4">Reference</th>
              <th className="py-2.5 pr-4">Method</th>
              <th className="py-2.5 pr-4">Plan</th>
              <th className="py-2.5 text-right">Amount Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="py-3 pr-4 font-mono text-xs text-slate-500 tabular-nums">{formatDate(b.createdAt)}</td>
                <td className="py-3 pr-4 font-mono text-xs font-semibold text-[#102A43]">{b.reference}</td>
                <td className="py-3 pr-4">{b.paymentMethod}</td>
                <td className="py-3 pr-4 text-xs text-slate-500">{b.paymentPlan}</td>
                <td className="py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">{formatCurrency(b.paidAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CustomerInvoicesPage: React.FC = () => {
  const { bookings, showToast } = useApp();

  const downloadInvoice = (ref: string, title: string, amount: number) => {
    const blob = new Blob([`KARAKORAM VOYAGES INVOICE\nRef: ${ref}\nTour: ${title}\nPaid: ${formatCurrency(amount)}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Invoice downloaded', `Invoice-${ref}.txt`);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Official Invoices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold text-[#168AAD]">INV-{b.reference}</p>
              <p className="font-semibold text-sm text-[#102A43] mt-0.5">{b.packageTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">{formatCurrency(b.totalAmount)}</p>
            </div>
            <button
              type="button"
              onClick={() => downloadInvoice(b.reference, b.packageTitle, b.paidAmount)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#102A43] hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomerDocumentsPage: React.FC = () => {
  const { showToast } = useApp();
  const [docs, setDocs] = useState([
    { id: 'd1', name: 'Passport Bio Page — Usama Goraya.pdf', status: 'Verified', uploaded: '2026-11-12' },
    { id: 'd2', name: 'Travel Insurance Policy #PK-9921.pdf', status: 'Active', uploaded: '2026-11-14' },
  ]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">My Travel Documents</h1>
        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold cursor-pointer hover:bg-[#168AAD]">
          <Upload className="w-3.5 h-3.5" /> Upload Document
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setDocs((prev) => [
                  { id: `d-${Date.now()}`, name: file.name, status: 'Pending Review', uploaded: new Date().toISOString().slice(0, 10) },
                  ...prev,
                ]);
                showToast('Document uploaded', file.name);
              }
            }}
          />
        </label>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {docs.map((doc) => (
          <div key={doc.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#102A43]">{doc.name}</p>
              <p className="text-xs text-slate-500">Uploaded {doc.uploaded}</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700">{doc.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomerSavedTravelersPage: React.FC = () => {
  const { savedTravelers, addSavedTraveler, removeSavedTraveler } = useApp();
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('Pakistani');
  const [passportNumber, setPassportNumber] = useState('');

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Saved Companions</h1>
      <div className="space-y-3">
        {savedTravelers.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-[#102A43]">{t.fullName} · {t.relationship}</p>
              <p className="text-xs text-slate-500 font-mono">Passport: {t.passportNumber} · {t.nationality}</p>
            </div>
            <button type="button" onClick={() => removeSavedTraveler(t.id)} className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!fullName.trim()) return;
          addSavedTraveler({ fullName, relationship, dob, nationality, passportNumber });
          setFullName('');
          setPassportNumber('');
        }}
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-[#102A43]">Add Companion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input placeholder="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input placeholder="Passport / CNIC" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono" />
        </div>
        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Save Traveler
        </button>
      </form>
    </div>
  );
};

export const CustomerWishlistPage: React.FC = () => {
  const { packages, wishlist } = useApp();
  const saved = packages.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Saved Wishlist ({saved.length})</h1>
      {saved.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <p className="text-sm text-slate-600">No tour packages saved yet.</p>
          <Link to="/packages" className="inline-block px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
            Browse Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saved.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomerReviewsPage: React.FC = () => {
  const { reviews } = useApp();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">My Published Reviews</h1>
        <Link to="/reviews" className="text-xs font-semibold text-[#168AAD] hover:underline">Write New Review →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.slice(0, 4).map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
};

export const CustomerTicketsPage: React.FC = () => {
  const { tickets, addTicket } = useApp();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Booking' | 'Visa' | 'Payment' | 'Itinerary'>('Booking');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Support Tickets</h1>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm text-[#102A43]">{t.subject}</p>
              <span className="text-xs font-semibold text-[#168AAD]">{t.status}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{t.message}</p>
            <p className="text-[11px] text-slate-400 mt-2">{t.category} · Updated {t.lastUpdate}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!subject.trim() || !message.trim()) return;
          addTicket({ subject, category, message });
          setSubject('');
          setMessage('');
        }}
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-[#102A43]">Open New Concierge Ticket</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            required
            placeholder="Ticket subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="sm:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="Booking">Booking</option>
            <option value="Visa">Visa</option>
            <option value="Payment">Payment</option>
            <option value="Itinerary">Itinerary</option>
          </select>
        </div>
        <textarea
          rows={3}
          required
          placeholder="How can our concierge team assist?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm"
        />
        <button type="submit" className="px-5 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export const CustomerNotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead } = useApp();
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Notifications</h1>
        <button type="button" onClick={markAllNotificationsRead} className="text-xs font-semibold text-[#168AAD] hover:underline">
          Mark all as read
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className={`p-5 ${n.read ? 'opacity-70' : 'bg-[#168AAD]/[0.03]'}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#102A43]">{n.title}</p>
              <span className="text-xs font-mono text-slate-400 tabular-nums">{formatDate(n.date)}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomerPasswordPage: React.FC = () => {
  const { showToast } = useApp();
  const [curr, setCurr] = useState('');
  const [nextPw, setNextPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (nextPw !== confirmPw) {
          showToast('Passwords do not match', undefined, 'error');
          return;
        }
        showToast('Password updated successfully');
        setCurr('');
        setNextPw('');
        setConfirmPw('');
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 max-w-md"
    >
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Change Password</h1>
      <input type="password" required placeholder="Current Password" value={curr} onChange={(e) => setCurr(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
      <input type="password" required minLength={6} placeholder="New Password" value={nextPw} onChange={(e) => setNextPw(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
      <input type="password" required minLength={6} placeholder="Confirm New Password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]">
        Update Password
      </button>
    </form>
  );
};
