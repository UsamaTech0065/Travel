import React, { useState } from 'react';
import { CheckCircle2, FileText, Search, Upload } from 'lucide-react';
import { VISA_COUNTRIES } from '../../data/hotelsFlightsVisa';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { SafeImage } from '../../components/common/SafeImage';
import { LOCAL_IMAGES } from '../../data/images';

export const VisaPage: React.FC = () => {
  const { visaApplications, addVisaApplication, showToast } = useApp();

  const [selectedCountryId, setSelectedCountryId] = useState(VISA_COUNTRIES[0].id);
  const selectedCountry = VISA_COUNTRIES.find((c) => c.id === selectedCountryId) || VISA_COUNTRIES[0];
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const activeCategory = selectedCountry.categories[selectedCategoryIdx] || selectedCountry.categories[0];

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [travelDate, setTravelDate] = useState('2027-06-01');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Tracking lookup
  const [trackCode, setTrackCode] = useState('KV-VISA-8842');
  const trackedApp = visaApplications.find(
    (v) => v.trackingCode.toLowerCase() === trackCode.trim().toLowerCase()
  );

  const handleSubmitVisa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !email.includes('@')) return;
    const code = `KV-VISA-${Math.floor(1000 + Math.random() * 9000)}`;
    addVisaApplication({
      id: `va-${Date.now()}`,
      applicantName: applicantName.trim(),
      email: email.trim(),
      country: selectedCountry.country,
      visaType: activeCategory.type,
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'Under Review',
      trackingCode: code,
      feePaid: activeCategory.feeUsd,
    });
    setTrackCode(code);
    setApplicantName('');
    setEmail('');
    setPassportNo('');
    setUploadedFileName('');
  };

  return (
    <div className="pt-16">
      <section className="relative h-64 flex items-end bg-[#102A43]">
        <SafeImage
          src={LOCAL_IMAGES.heroHunza}
          alt="Pakistan Travel Permits, NOCs & E-Visa LOI Concierge"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/70 to-[#102A43]/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 text-white">
          <p className="text-xs font-semibold text-[#E5AD50] mb-1.5">Gilgit-Baltistan Permits · AJK NOCs · Pakistan Inbound LOIs</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold">Permits, NOCs &amp; E-Visa Desk</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Permit / E-Visa Selector & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="visa-country" className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Select Permit / NOC Region
                  </label>
                  <select
                    id="visa-country"
                    value={selectedCountryId}
                    onChange={(e) => {
                      setSelectedCountryId(e.target.value);
                      setSelectedCategoryIdx(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#102A43]"
                  >
                    {VISA_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                    Permit / Pass Tier
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.categories.map((cat, idx) => (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => setSelectedCategoryIdx(idx)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          selectedCategoryIdx === idx
                            ? 'bg-[#102A43] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Processing Time</p>
                  <p className="text-sm font-semibold text-[#102A43] mt-0.5">{activeCategory.processingTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Estimated Fee</p>
                  <p className="font-mono text-lg font-bold text-[#168AAD] tabular-nums mt-0.5">
                    {formatCurrency(activeCategory.feeUsd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stay Validity</p>
                  <p className="text-sm font-semibold text-[#102A43] mt-0.5">{activeCategory.validity}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-[#102A43] mb-3 inline-flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#168AAD]" />
                  Required Document Checklist
                </h2>
                <ul className="space-y-2 text-sm text-slate-600">
                  {activeCategory.documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Application Tracking */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#102A43]">
                Track Existing Permit / E-Visa Request
              </h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. KV-VISA-8842)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              {trackedApp ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-[#102A43]">
                      {trackedApp.applicantName} · {trackedApp.country}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {trackedApp.visaType} · Submitted {trackedApp.submittedDate}
                    </p>
                  </div>
                  <span className="font-semibold text-xs text-[#168AAD] bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                    Status: {trackedApp.status}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Try sample codes: <span className="font-mono">KV-VISA-8842</span>, <span className="font-mono">KV-VISA-9015</span>, or <span className="font-mono">KV-VISA-9108</span>.
                </p>
              )}
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmitVisa} className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#102A43]">
              Start Permit / LOI Request
            </h2>
            <p className="text-xs text-slate-500">
              Applying for: <strong className="text-[#102A43]">{selectedCountry.country} ({activeCategory.type})</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Full Name (as on CNIC / Passport)</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">CNIC / Passport No.</label>
                <input
                  type="text"
                  required
                  value={passportNo}
                  onChange={(e) => setPassportNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Intended Travel</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Upload CNIC or Passport Scan (PDF / JPG)
              </label>
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 cursor-pointer hover:border-[#168AAD] transition-colors">
                <Upload className="w-5 h-5 text-[#168AAD] mb-1.5" />
                <span className="text-xs font-medium text-[#102A43]">
                  {uploadedFileName || 'Click to attach ID or passport scan'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFileName(file.name);
                      showToast('Document attached', file.name, 'info');
                    }
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
            >
              Submit Permit File ({formatCurrency(activeCategory.feeUsd)})
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
