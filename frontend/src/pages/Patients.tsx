import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  FilePlus2,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { Patient } from '../types/patient';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      try {
        const data = await api.getPatients({ q: searchQuery, gender: genderFilter });
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [searchQuery, genderFilter]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & New Patient Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Patient Registry & EHR Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Search active patients, view past clinical encounters, or launch a new case-taking session.
          </p>
        </div>

        <button
          onClick={() => navigate('/patients/new')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, ID (AYU-2026-001), Phone number, or ABHA..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Contact / Location</th>
                <th className="p-3.5">ABHA Status</th>
                <th className="p-3.5">Allergies & Co-morbidities</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Loading patient directory...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {p.gender}, {p.age} yrs • {p.patient_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{p.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{p.city}, {p.state}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={p.abha_status === 'Linked' ? 'emerald' : 'slate'} dot>
                        {p.abha_status || 'Unlinked'}
                      </Badge>
                      {p.abha_id && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                          {p.abha_id}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="text-rose-700 font-medium truncate text-[11px]">
                        {p.allergies ? `⚠️ ${p.allergies}` : 'No known allergies'}
                      </p>
                      <p className="text-slate-500 truncate text-[10px] mt-0.5">
                        {p.medical_history || 'No chronic history'}
                      </p>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/patients/${p.id}`)}
                          className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => navigate(`/cases/new?patientId=${p.id}`)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1"
                        >
                          <FilePlus2 className="w-3.5 h-3.5" />
                          <span>New Case</span>
                        </button>
                      </div>
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
