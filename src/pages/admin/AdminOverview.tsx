import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { ADMIN_DESTINATION_SHARE, ADMIN_MONTHLY_REVENUE } from '../../data/reviewsAndAdmin';
import { formatCurrency, formatDate } from '../../utils/format';

export const AdminOverview: React.FC = () => {
  const { bookings, customers, packages, notifications } = useApp();
  const [timeframe, setTimeframe] = useState<'12m' | '6m' | 'q4'>('12m');

  const chartData =
    timeframe === '6m'
      ? ADMIN_MONTHLY_REVENUE.slice(6)
      : timeframe === 'q4'
      ? ADMIN_MONTHLY_REVENUE.slice(9)
      : ADMIN_MONTHLY_REVENUE;

  const totalRevenue = bookings.reduce((s, b) => s + b.totalAmount, 0) + 1284100;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="space-y-8">
      {/* Header + Date Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#102A43]">Operations Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Live reservations, revenue trajectory, and upcoming departures across Pakistan routes.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {[
            { id: '12m', label: '12 Months' },
            { id: '6m', label: 'Last 6 Months' },
            { id: 'q4', label: 'Q4 Peak' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeframe(t.id as typeof timeframe)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                timeframe === t.id ? 'bg-[#102A43] text-white' : 'text-slate-600 hover:text-[#102A43]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Revenue', val: formatCurrency(totalRevenue), note: '+18.4% YoY' },
          { label: 'Total Bookings', val: String(bookings.length + 784), note: 'Across 12 routes' },
          { label: 'Total Customers', val: String(customers.length + 1410), note: '+142 this quarter' },
          { label: 'Active Packages', val: String(packages.length), note: 'Local Pakistan Tours' },
          { label: 'Pending Bookings', val: String(pendingCount), note: 'Needs confirmation' },
          { label: 'Upcoming Tours', val: '19', note: 'Next 60 days' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-medium text-slate-500">{kpi.label}</p>
            <p className="font-mono text-xl font-bold text-[#102A43] mt-1 tabular-nums">{kpi.val}</p>
            <p className="text-[11px] text-[#168AAD] mt-1">{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Monthly Revenue + Bookings Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Monthly Revenue (USD)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#168AAD" fill="#168AAD" fillOpacity={0.18} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Monthly Booking Volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#102A43" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Popular Destinations + Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Popular Destinations by Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_DESTINATION_SHARE} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={115} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#E5AD50" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Customer Acquisition Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#168AAD" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Tables: Recent Bookings + Upcoming Departures & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#102A43]">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-semibold text-[#168AAD] hover:underline">
              Manage All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3">Ref</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Destination</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-3 font-mono font-semibold text-[#102A43]">{b.reference}</td>
                    <td className="py-3 pr-3">{b.customerName}</td>
                    <td className="py-3 pr-3 text-slate-600">{b.destination}</td>
                    <td className="py-3 pr-3 font-semibold text-[#168AAD]">{b.status}</td>
                    <td className="py-3 text-right font-mono font-semibold tabular-nums">{formatCurrency(b.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-[#102A43] mb-3">Upcoming Departures</h2>
            <div className="space-y-2.5 text-xs">
              {packages.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div className="min-w-0 pr-3">
                    <p className="font-semibold text-[#102A43] truncate">{p.title}</p>
                    <p className="text-slate-500 font-mono tabular-nums">{formatDate(p.departureDates[0])}</p>
                  </div>
                  <span className="font-mono font-semibold text-emerald-700 shrink-0 tabular-nums">
                    {p.availableSeats} seats
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#102A43] mb-2">Latest Activity</h2>
            <div className="space-y-2 text-xs text-slate-600">
              {notifications.slice(0, 3).map((n) => (
                <p key={n.id} className="truncate">• {n.title}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
