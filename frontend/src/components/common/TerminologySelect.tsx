import React, { useState, useEffect } from 'react';
import { Search, Tag, Check, Sparkles, Database } from 'lucide-react';
import { api } from '../../services/api';
import { TerminologyItem } from '../../types/terminology';

interface TerminologySelectProps {
  onSelectTerm: (term: TerminologyItem) => void;
  category?: string;
  placeholder?: string;
}

export const TerminologySelect: React.FC<TerminologySelectProps> = ({
  onSelectTerm,
  category,
  placeholder = 'Search NAMASTE / AYUSH standardized terms (e.g., Shirahshoola, Amlapitta)...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TerminologyItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const terms = await api.searchTerminology(query, category);
        setResults(terms);
      } catch (err) {
        console.error('Error fetching terminology:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, category]);

  const handleSelect = (term: TerminologyItem) => {
    onSelectTerm(term);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin block" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>NAMASTE Standardized Terminology (Demo)</span>
            <span className="text-emerald-700">{results.length} found</span>
          </div>
          {results.map((term) => (
            <button
              key={term.id}
              type="button"
              onClick={() => handleSelect(term)}
              className="w-full text-left px-3 py-2.5 hover:bg-emerald-50/80 transition-colors border-b border-slate-50 last:border-0 flex items-start justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-emerald-900">
                    {term.preferred_term}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-200">
                    {term.code}
                  </span>
                </div>
                {term.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {term.description}
                  </p>
                )}
              </div>
              {term.dosha_affinity && (
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded shrink-0">
                  {term.dosha_affinity}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
