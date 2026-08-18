import React, { useState } from 'react';
import { CurrencyCode } from '../types';
import { SUPPORTED_CURRENCIES, getCurrencyInfo } from '../lib/currency';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  className?: string;
  showFullLabel?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
  className = '',
  showFullLabel = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const currentInfo = getCurrencyInfo(currentCurrency);

  const filtered = SUPPORTED_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-sm">{currentInfo.flag}</span>
        <span className="font-mono text-cyan-600 dark:text-cyan-400">{currentInfo.code}</span>
        <span className="text-slate-500 font-normal">({currentInfo.symbol})</span>
        {showFullLabel && <span className="hidden sm:inline text-slate-400 font-normal">{currentInfo.name}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-500" />
              Select Preferred Currency
            </span>
            <span className="text-[10px] text-slate-400 font-mono">10 Currencies</span>
          </div>

          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search currencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onCurrencyChange(c.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors ${
                  currentCurrency === c.code
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <span className="font-mono font-bold mr-1.5">{c.code}</span>
                    <span className="text-slate-500 font-normal">({c.symbol})</span>
                    <div className="text-[10px] text-slate-400 truncate">{c.name}</div>
                  </div>
                </div>
                {currentCurrency === c.code && <Check className="w-4 h-4 text-cyan-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
