import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../../components/common/SafeImage';
import { LOCAL_IMAGES } from '../../data/images';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('usamagoraya413@gmail.com');
  const [password, setPassword] = useState('••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'customer');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-16 grid grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="hidden lg:block relative bg-[#102A43]">
        <SafeImage src={LOCAL_IMAGES.heroHunza} alt="Hunza Valley" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="font-serif text-3xl font-semibold">Welcome Back to Your Expedition Portal</p>
          <p className="mt-2 text-sm text-slate-200">
            Access upcoming departure vouchers, visas, saved itineraries, and direct concierge support.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#102A43]">Sign In</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your Karakoram Voyages reservations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#102A43]">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#168AAD] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD] transition-colors"
            >
              Sign In to Customer Portal
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                login('admin@karakoramvoyages.com', 'admin', 'Tariq Mehmood');
                navigate('/admin');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-[#102A43] hover:bg-slate-50"
            >
              Demo Sign In as Admin Console
            </button>
            <p className="text-center text-xs text-slate-500">
              New traveler?{' '}
              <Link to="/register" className="font-semibold text-[#168AAD] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@')) return;
    login(email, 'customer', name.trim());
    navigate('/verify-email');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#102A43]">Create Traveler Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join Summit Club for priority departures and saved companions</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
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
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Phone / WhatsApp</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#168AAD]"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#168AAD] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 space-y-5">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Reset Your Password</h1>
        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              A password reset link has been sent to <strong>{email}</strong>.
            </p>
            <Link
              to="/reset-password"
              className="block w-full text-center py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold"
            >
              Open Reset Password Screen
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <p className="text-sm text-slate-500">Enter your email address to receive reset instructions.</p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 space-y-5">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Choose New Password</h1>
        {done ? (
          <div className="space-y-4">
            <p className="text-sm text-emerald-700 inline-flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Password updated successfully.
            </p>
            <Link to="/login" className="block w-full text-center py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const { user } = useApp();
  const [verified, setVerified] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#168AAD]/10 text-[#168AAD] flex items-center justify-center">
          <MailCheck className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">
          {verified ? 'Email Verified' : 'Verify Your Email Address'}
        </h1>
        <p className="text-sm text-slate-600">
          {verified
            ? 'Your Summit Club traveler account is active and ready.'
            : `We dispatched a verification link to ${user?.email || 'your email'}. Confirm below to continue to your dashboard.`}
        </p>
        {verified ? (
          <Link to="/dashboard" className="block w-full py-3 rounded-xl bg-[#102A43] text-white text-sm font-semibold">
            Open Customer Dashboard
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setVerified(true)}
            className="w-full py-3 rounded-xl bg-[#168AAD] text-white text-sm font-semibold hover:bg-[#102A43]"
          >
            Confirm Verification Now
          </button>
        )}
      </div>
    </div>
  );
};
