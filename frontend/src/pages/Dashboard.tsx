import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FilePlus2,
  UserPlus,
  History,
  Activity,
  ArrowRight,
  TrendingUp,
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { DoshaDistributionChart } from '../components/charts/DoshaDistributionChart';
import { WeeklyCasesChart } from '../components/charts/WeeklyCasesChart';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStatsData(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = statsData?.stats || {
    total_patients: 5,
    today_cases: 4,
    pending_reviews: 2,
    followups_due: 3,
  };

  const recentEncounters = statsData?.recent_encounters || [];
  const recentPatients = statsData?.recent_patients || [];
  const doshaDistribution = statsData?.dosha_distribution || [
    { name: 'Vata (वात)', value: 42, fill: '#8B5CF6' },
    { name: 'Pitta (पित्त)', value: 36, fill: '#EF4444' },
    { name: 'Kapha (कफ)', value: 22, fill: '#10B981' },
  ];
  const weeklyTrend = statsData?.weekly_trend || [
    { day: 'Mon', cases: 6, completed: 5 },
    { day: 'Tue', cases: 9, completed: 8 },
    { day: 'Wed', cases: 11, completed: 9 },
    { day: 'Thu', cases: 8, completed: 7 },
    { day: 'Fri', cases: 14, completed: 12 },
    { day: 'Sat', cases: 10, completed: 9 },
    { day: 'Sun', cases: 4, completed: 4 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Clinical OPD Operations
            </span>
            <span className="text-xs text-emerald-300">All India Institute of Ayurveda</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-2">
            Welcome, Dr. Rajesh Varma
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5 max-w-xl">
            From unstructured clinical conversation to a structured digital case in minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/cases/new')}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>+ Start Case-Taking</span>
          </button>
          <button
            onClick={() => navigate('/patients/new')}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register Patient</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Patients"
          value={stats.total_patients}
          subtitle="Active clinical records"
          icon={Users}
          trend="+12%"
          trendUp={true}
          color="emerald"
        />
        <StatCard
          title="Today's Case Sessions"
          value={stats.today_cases}
          subtitle="OPD consultations today"
          icon={Calendar}
          trend="+4 today"
          trendUp={true}
          color="teal"
        />
        <StatCard
          title="In-Progress Drafts"
          value={stats.pending_reviews}
          subtitle="Awaiting final review"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Follow-ups Due"
          value={stats.followups_due}
          subtitle="Scheduled review visits"
          icon={CheckCircle2}
          color="blue"
        />
      </div>

      {/* Main Grid: Today's Cases (Left 8 cols) & Analytics (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Cases Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's OPD Consultation Cases</h3>
                <p className="text-xs text-slate-500">Live queue with status tracking</p>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">Chief Complaint</th>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEncounters.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No active cases found for today.
                      </td>
                    </tr>
                  ) : (
                    recentEncounters.map((enc: any) => (
                      <tr key={enc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{enc.patient_name}</div>
                          <div className="text-[11px] text-slate-500">
                            {enc.gender}, {enc.age} yrs • {enc.patient_code}
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="font-medium text-slate-800 truncate">{enc.chief_complaint}</p>
                        </td>
                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{enc.time}</td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              enc.status === 'Completed'
                                ? 'emerald'
                                : enc.status === 'In Progress'
                                ? 'amber'
                                : 'blue'
                            }
                            dot
                          >
                            {enc.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => navigate(`/cases/${enc.id}`)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                          >
                            Open Case
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Consultation Trends Area Chart */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Consultation Volume</h3>
                <p className="text-xs text-slate-500">Total cases vs. completed clinical summaries</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Consultations
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Completed
                </span>
              </div>
            </div>
            <WeeklyCasesChart data={weeklyTrend} />
          </div>
        </div>

        {/* Right Column: Dosha Analytics & Recent Patients */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dosha Distribution */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <span>Patient Population Dosha Bias</span>
              </h3>
              <p className="text-xs text-slate-500">Aggregate Prakriti constitution breakdown</p>
            </div>

            <DoshaDistributionChart data={doshaDistribution} />

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Calculated from transparent questionnaire-based rule engine scoring.
              </span>
            </div>
          </div>

          {/* Recent Registered Patients */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Patients</h3>
              <button
                onClick={() => navigate('/patients')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Directory
              </button>
            </div>

            <div className="space-y-2">
              {recentPatients.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {p.gender}, {p.age} yrs • ID: {p.patient_code}
                    </p>
                  </div>
                  <Badge variant={p.abha_status === 'Linked' ? 'emerald' : 'slate'}>
                    {p.abha_status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
