import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  FilePlus2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Encounter } from '../types/case';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';

export const CaseHistory: React.FC = () => {
  const navigate = useNavigate();
  const [encounters, setEncounters] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEncounters() {
      setLoading(true);
      try {
        const data = await api.getEncounters({ status: statusFilter });
        setEncounters(data);
      } catch (err) {
        console.error('Failed to load encounters history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEncounters();
  }, [statusFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Clinical Case Consultation History</span>
          </h1>
          <p className="text-xs text-slate-500">
            Chronological archive of all patient case-taking sessions and clinical summaries.
          </p>
        </div>

        <button
          onClick={() => navigate('/cases/new')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>+ Start New Case</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by chief complaint, symptom, or notes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Follow-up">Follow-up</option>
          </select>
        </div>
      </div>

      {/* Encounters List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Case ID & Date</th>
                <th className="p-3.5">Chief Complaint / Summary</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading case history...
                  </td>
                </tr>
              ) : encounters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No cases recorded matching the filter.
                  </td>
                </tr>
              ) : (
                encounters.map((enc) => (
                  <tr key={enc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 font-mono">#ENC-{enc.id}</span>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(enc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-lg">
                      <p className="font-bold text-slate-800">{enc.chief_complaint || 'General consultation'}</p>
                      {enc.hpi && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {enc.hpi}
                        </p>
                      )}
                    </td>
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
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                      >
                        Open Case Sheet
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
