import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, CreditCard, Download, Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, generateBookingRef } from '../../utils/format';
import { BookingRecord } from '../../types';
import { SafeImage } from '../../components/common/SafeImage';

const passengerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email address required'),
  phone: z.string().min(7, 'Valid phone number required'),
  nationality: z.string().min(2, 'Nationality is required'),
  dob: z.string().min(4, 'Date of birth is required'),
  passportNumber: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type PassengerFormData = z.infer<typeof passengerSchema>;

const ADD_ONS = [
  { id: 'hotel-upgrade', label: '5-Star Panorama Suite Upgrade', price: 180 },
  { id: 'pickup', label: 'Private Airport VIP Pickup & Drop', price: 65 },
  { id: 'insurance', label: 'Comprehensive Medical & Evacuation Insurance', price: 85 },
  { id: 'helicopter', label: 'Karakoram Aerial Glacier Excursion Add-on', price: 320 },
];

export const BookingFlowPage: React.FC = () => {
  const { packages, coupons, addBooking, user, showToast } = useApp();
  const [searchParams] = useSearchParams();

  const initialPkgId = searchParams.get('package') || packages[0]?.id;
  const [selectedPkgId, setSelectedPkgId] = useState(initialPkgId);
  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === selectedPkgId) || packages[0],
    [packages, selectedPkgId]
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [departureDate, setDepartureDate] = useState(
    searchParams.get('date') || selectedPkg.departureDates[0] || '2027-05-15'
  );
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 2);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
  const [roomType, setRoomType] = useState<'Standard Twin' | 'Deluxe Panorama' | 'Executive Suite'>(
    (searchParams.get('room') as BookingRecord['roomType']) || 'Deluxe Panorama'
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(
    searchParams.get('extras') ? searchParams.get('extras')!.split(',').filter(Boolean) : ['pickup']
  );

  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const [paymentPlan, setPaymentPlan] = useState<'Full Payment' | 'Advance 30%'>('Full Payment');
  const [paymentMethod, setPaymentMethod] = useState<'Card Payment' | 'Bank Transfer' | 'Advance Deposit'>('Card Payment');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const [passengerSnapshot, setPassengerSnapshot] = useState<PassengerFormData>({
    firstName: user?.name.split(' ')[0] || 'Usama',
    lastName: user?.name.split(' ').slice(1).join(' ') || 'Goraya',
    email: user?.email || 'usamagoraya413@gmail.com',
    phone: user?.phone || '+92 300 5550192',
    nationality: 'Pakistani',
    dob: '1994-05-14',
    passportNumber: 'PK8829104',
    specialRequirements: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues: passengerSnapshot,
  });

  const roomUpcharge = roomType === 'Executive Suite' ? 240 : roomType === 'Deluxe Panorama' ? 110 : 0;
  const extrasSum = selectedAddOns.reduce(
    (sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price || 0),
    0
  );
  const subtotal = adults * selectedPkg.price + children * Math.round(selectedPkg.price * 0.65) + roomUpcharge + extrasSum;

  const activeCoupon = coupons.find((c) => c.code === appliedCouponCode && c.active);
  const discountAmount = activeCoupon ? Math.round((subtotal * activeCoupon.discountPercent) / 100) : 0;
  const totalAmount = Math.max(subtotal - discountAmount, 0);
  const dueNow = paymentPlan === 'Advance 30%' ? Math.round(totalAmount * 0.3) : totalAmount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code === code && c.active);
    if (!found) {
      showToast('Invalid or expired coupon', 'Try KARAKORAM10, HUNZA15, or WELCOME12.', 'error');
      return;
    }
    setAppliedCouponCode(found.code);
    showToast(`Coupon ${found.code} applied`, `${found.discountPercent}% discount deducted.`);
  };

  const onPassengerSubmit = (data: PassengerFormData) => {
    setPassengerSnapshot(data);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    const record: BookingRecord = {
      id: `bk-${Date.now()}`,
      reference: generateBookingRef(),
      packageId: selectedPkg.id,
      packageTitle: selectedPkg.title,
      destination: selectedPkg.destinationName,
      customerId: user?.id || 'guest',
      customerName: `${passengerSnapshot.firstName} ${passengerSnapshot.lastName}`,
      customerEmail: passengerSnapshot.email,
      departureDate,
      adults,
      children,
      roomType,
      extras: selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.label || id),
      paymentMethod,
      paymentPlan,
      subtotal,
      discountAmount,
      totalAmount,
      paidAmount: dueNow,
      status: paymentMethod === 'Bank Transfer' ? 'Pending' : 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
      passengerDetails: passengerSnapshot,
    };

    addBooking(record);
    setConfirmedBooking(record);
    setStep(5);
    showToast('Reservation Confirmed', `Booking reference ${record.reference} generated.`);
  };

  const handleDownloadInvoice = () => {
    if (!confirmedBooking) return;
    const text = [
      'KARAKORAM VOYAGES — OFFICIAL BOOKING INVOICE',
      `Reference: ${confirmedBooking.reference}`,
      `Date: ${confirmedBooking.createdAt}`,
      `Traveler: ${confirmedBooking.customerName} (${confirmedBooking.customerEmail})`,
      `Package: ${confirmedBooking.packageTitle}`,
      `Departure: ${confirmedBooking.departureDate}`,
      `Travelers: ${confirmedBooking.adults} Adults, ${confirmedBooking.children} Children`,
      `Room Tier: ${confirmedBooking.roomType}`,
      `Total Amount: ${formatCurrency(confirmedBooking.totalAmount)}`,
      `Paid Today: ${formatCurrency(confirmedBooking.paidAmount)} (${confirmedBooking.paymentMethod})`,
      `Status: ${confirmedBooking.status}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${confirmedBooking.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Invoice downloaded', `Saved Invoice-${confirmedBooking.reference}.txt`);
  };

  const stepLabels = ['1. Package', '2. Passenger Info', '3. Services', '4. Payment', '5. Confirmation'];

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#168AAD] mb-1">Secure Reservation Checkout</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43]">
            Complete Your Expedition Booking
          </h1>
        </div>

        {/* 5-Step Progress Indicator */}
        <nav aria-label="Booking Steps" className="mb-10">
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const active = step === stepNum;
              const done = step > stepNum;
              return (
                <li
                  key={label}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-[#102A43] bg-[#102A43] text-white'
                      : done
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {done && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Step Panel */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[#102A43]">
                  Step 1: Package &amp; Traveler Selection
                </h2>

                <div>
                  <label htmlFor="select-pkg" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Selected Tour Package
                  </label>
                  <select
                    id="select-pkg"
                    value={selectedPkg.id}
                    onChange={(e) => {
                      const nextPkg = packages.find((p) => p.id === e.target.value);
                      setSelectedPkgId(e.target.value);
                      if (nextPkg) setDepartureDate(nextPkg.departureDates[0]);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#102A43]"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({formatCurrency(p.price)}/person)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="s1-date" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                      Departure Date
                    </label>
                    <select
                      id="s1-date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                    >
                      {selectedPkg.departureDates.map((d) => (
                        <option key={d} value={d}>{formatDate(d)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="s1-adults" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                      Adults
                    </label>
                    <input
                      id="s1-adults"
                      type="number"
                      min={1}
                      max={12}
                      value={adults}
                      onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="s1-children" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                      Children (35% off)
                    </label>
                    <input
                      id="s1-children"
                      type="number"
                      min={0}
                      max={8}
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="s1-room" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Room Category
                  </label>
                  <select
                    id="s1-room"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as BookingRecord['roomType'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  >
                    <option value="Standard Twin">Standard Twin (Included)</option>
                    <option value="Deluxe Panorama">Deluxe Panorama (+$110)</option>
                    <option value="Executive Suite">Executive Suite (+$240)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
                  >
                    Continue to Passenger Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit(onPassengerSubmit)} className="space-y-5">
                <h2 className="font-serif text-2xl font-semibold text-[#102A43]">
                  Step 2: Lead Passenger Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">First Name</label>
                    <input
                      {...register('firstName')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    {errors.firstName && <p className="text-xs text-rose-600 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">Last Name</label>
                    <input
                      {...register('lastName')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    {errors.lastName && <p className="text-xs text-rose-600 mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">Phone / WhatsApp</label>
                    <input
                      {...register('phone')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">Nationality</label>
                    <input
                      {...register('nationality')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    {errors.nationality && <p className="text-xs text-rose-600 mt-1">{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      {...register('dob')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm tabular-nums"
                    />
                    {errors.dob && <p className="text-xs text-rose-600 mt-1">{errors.dob.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    CNIC / Passport Number (Required for Domestic Flights &amp; Northern Permits)
                  </label>
                  <input
                    {...register('passportNumber')}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Dietary or Accessibility Requirements
                  </label>
                  <textarea
                    rows={3}
                    {...register('specialRequirements')}
                    placeholder="Vegetarian meals, wheelchair assistance, connecting family rooms..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#102A43]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
                  >
                    Continue to Additional Services <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[#102A43]">
                  Step 3: Additional Concierge Services
                </h2>
                <div className="space-y-3">
                  {ADD_ONS.map((addon) => {
                    const checked = selectedAddOns.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors ${
                          checked ? 'border-[#168AAD] bg-[#168AAD]/5' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedAddOns((prev) =>
                                prev.includes(addon.id) ? prev.filter((x) => x !== addon.id) : [...prev, addon.id]
                              )
                            }
                            className="rounded accent-[#168AAD]"
                          />
                          <span className="text-sm font-semibold text-[#102A43]">{addon.label}</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#102A43] tabular-nums">
                          +{formatCurrency(addon.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#102A43]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[#102A43]">
                  Step 4: Payment Plan &amp; Method
                </h2>

                <div>
                  <p className="text-xs font-semibold text-[#102A43] mb-2">Choose Payment Plan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['Full Payment', 'Advance 30%'] as const).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setPaymentPlan(plan)}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          paymentPlan === plan ? 'border-[#102A43] bg-[#102A43]/5' : 'border-slate-200'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#102A43]">{plan}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {plan === 'Full Payment'
                            ? `Pay ${formatCurrency(totalAmount)} today`
                            : `Pay ${formatCurrency(Math.round(totalAmount * 0.3))} deposit now, balance later`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#102A43] mb-2">Payment Method</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['Card Payment', 'Bank Transfer', 'Advance Deposit'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-xl border px-4 py-3 text-xs font-semibold transition-colors ${
                          paymentMethod === method
                            ? 'border-[#168AAD] bg-[#168AAD] text-white'
                            : 'border-slate-200 text-[#102A43] hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'Bank Transfer' ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-[#102A43]">IBFT / Wire Transfer Details</p>
                    <p>Account Title: Karakoram Voyages Pvt Ltd · IBAN: PK84MEZN0003120104829102</p>
                    <p>Your reservation holds immediately for 24 hours pending receipt confirmation.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#102A43]">
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#168AAD]" /> Card Details (Demo Checkout)
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Lock className="w-3.5 h-3.5" /> Encrypted
                      </span>
                    </div>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8910"
                      aria-label="Card number"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" defaultValue="08/29" aria-label="Expiry" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono" />
                      <input type="text" defaultValue="412" aria-label="CVC" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono" />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#102A43]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5AD50] text-[#102A43] text-sm font-bold hover:bg-[#eab964] transition-colors"
                  >
                    Confirm &amp; Pay {formatCurrency(dueNow)}
                  </button>
                </div>
              </div>
            )}

            {step === 5 && confirmedBooking && (
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Booking Status: {confirmedBooking.status}</p>
                  <h2 className="font-serif text-3xl font-semibold text-[#102A43]">
                    Your Expedition Is Reserved
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Reference: <span className="font-mono font-bold text-[#102A43]">{confirmedBooking.reference}</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-sm space-y-2 max-w-lg mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package</span>
                    <span className="font-semibold text-[#102A43] text-right">{confirmedBooking.packageTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Departure</span>
                    <span className="font-mono tabular-nums">{formatDate(confirmedBooking.departureDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guests</span>
                    <span>{confirmedBooking.adults} Adults, {confirmedBooking.children} Children</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-[#102A43]">Amount Paid</span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      {formatCurrency(confirmedBooking.paidAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD]"
                  >
                    <Download className="w-4 h-4" /> Download Invoice
                  </button>
                  <Link
                    to="/dashboard/bookings"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-[#102A43] hover:bg-slate-50"
                  >
                    View in My Bookings
                  </Link>
                  <Link
                    to="/destinations"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#168AAD] hover:underline"
                  >
                    Continue Exploring
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <SafeImage
                src={selectedPkg.image}
                alt={selectedPkg.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#168AAD]">{selectedPkg.destinationName}</p>
                <p className="font-semibold text-sm text-[#102A43] line-clamp-2">{selectedPkg.title}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{adults} Adults × {formatCurrency(selectedPkg.price)}</span>
                <span className="font-mono tabular-nums">{formatCurrency(adults * selectedPkg.price)}</span>
              </div>
              {children > 0 && (
                <div className="flex justify-between">
                  <span>{children} Children</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(children * Math.round(selectedPkg.price * 0.65))}
                  </span>
                </div>
              )}
              {roomUpcharge > 0 && (
                <div className="flex justify-between">
                  <span>{roomType}</span>
                  <span className="font-mono tabular-nums">+{formatCurrency(roomUpcharge)}</span>
                </div>
              )}
              {extrasSum > 0 && (
                <div className="flex justify-between">
                  <span>Selected Add-ons</span>
                  <span className="font-mono tabular-nums">+{formatCurrency(extrasSum)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo ({activeCoupon?.code})</span>
                  <span className="font-mono tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
            </div>

            {step < 5 && (
              <div className="pt-3 border-t border-slate-100">
                <label htmlFor="promo-input" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Promo Code (try HUNZA15)
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="KARAKORAM10"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#102A43]">Total Trip Value</span>
              <span className="font-mono text-xl font-bold text-[#102A43] tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
