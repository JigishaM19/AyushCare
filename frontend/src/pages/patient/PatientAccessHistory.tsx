import React, { useState, useEffect } from 'react';
import {
  History,
  Building2,
  ShieldCheck,
  Calendar,
  Lock,
  Clock,
  User,
  CheckCircle2
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { AccessLogItem } from '../../types/portal';
import { Badge } from '../../components/common/Badge';

export const PatientAccessHistory: React.FC = () => {
  const activePatient = getActivePatient();
  const [logs, setLogs] = useState<AccessLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await api.getPatientAccessHistory(activePatient.id);
        setLogs(data);
      } catch (err) {
        console.error('Failed to load access logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [activePatient.id]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-teal-600" />
          <span>Access Audit History & Security Log</span>
        </h1>
        <p className="text-xs text-slate-500">
          Transparent audit log showing every healthcare facility and practitioner that has accessed your records.
        </p>
      </div>

      {/* Trust & Control Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-bold text-slate-900">You Control Your Longitudinal Health Data</h2>
          <p className="text-slate-600 leading-relaxed">
            Every access event requires your explicit consent or a valid active temporary share token. Access timestamps and data categories are immutably logged for complete patient transparency.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Logged Access Events</h3>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {logs.length} Logged Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Healthcare Organization & Doctor</th>
                <th className="p-3.5">Data Accessed</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5 text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">Loading audit log...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">No access events recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{log.organization}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{log.accessor_name}</span>
                      </p>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {log.accessed_data}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <Badge variant={log.status === 'Authorized' ? 'emerald' : 'rose'} dot>
                        {log.status}
                      </Badge>
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
