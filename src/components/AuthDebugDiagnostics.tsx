import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAffiliateProfileFromFirestore } from '../lib/firestoreService';
import { ShieldCheck, UserCheck, ShieldAlert, ChevronDown, ChevronUp, Bug } from 'lucide-react';

interface AuthDebugDiagnosticsProps {
  activeView: string;
}

export const AuthDebugDiagnostics: React.FC<AuthDebugDiagnosticsProps> = ({ activeView }) => {
  const { user, userProfile, isAdmin, isSeller, isAffiliate, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAffiliateDoc, setHasAffiliateDoc] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.uid) {
      getAffiliateProfileFromFirestore(user.uid)
        .then(aff => setHasAffiliateDoc(!!aff))
        .catch(() => setHasAffiliateDoc(false));
    } else {
      setHasAffiliateDoc(false);
    }
  }, [user?.uid]);

  // Show only in non-production or when explicitly toggled
  return (
    <div className="fixed bottom-4 left-4 z-50 text-xs font-mono">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md cursor-pointer transition-all"
          title="Open Authentication Inspector"
        >
          <Bug className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[10px]">Auth Diagnostics</span>
          <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400' : 'bg-rose-500'}`} />
        </button>
      ) : (
        <div className="w-80 bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-3 backdrop-blur-xl text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
              <Bug className="w-4 h-4" />
              <span>NEXOVIRA Auth Inspector</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Auth status:</span>
              <span className={`font-bold ${user ? 'text-emerald-400' : 'text-rose-400'}`}>
                {loading ? 'Checking...' : user ? 'AUTHENTICATED' : 'UNAUTHENTICATED'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">User ID:</span>
              <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[140px]">
                {user ? user.uid : 'null'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Session:</span>
              <span className="font-bold text-slate-200">
                {user ? 'PRESENT' : 'MISSING'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Profile:</span>
              <span className={`font-bold ${userProfile ? 'text-emerald-400' : 'text-amber-400'}`}>
                {userProfile ? 'FOUND' : 'MISSING'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Database Role:</span>
              <span className="font-extrabold uppercase text-cyan-400">
                {userProfile?.role || 'customer'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Affiliate Profile:</span>
              <span className={`font-bold ${hasAffiliateDoc ? 'text-emerald-400' : 'text-slate-500'}`}>
                {hasAffiliateDoc === null ? 'Checking...' : hasAffiliateDoc ? 'FOUND (affiliates/)' : 'MISSING'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400">Current Route:</span>
              <span className="font-bold text-amber-400">
                /{activeView}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
