'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminSecurityGateProps {
  correctPin: string;
  onAuthenticated: () => void;
}

export default function AdminSecurityGate({ correctPin, onAuthenticated }: AdminSecurityGateProps) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if session already authenticated
    const saved = sessionStorage.getItem('loxxy_admin_auth');
    if (saved === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === (correctPin || 'loxxy2026')) {
      sessionStorage.setItem('loxxy_admin_auth', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background cyber lighting */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-dark-900/90 border border-slate-700/80 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/40 flex items-center justify-center mx-auto text-cyan-400">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-black text-white">
            Command Center Security Gate
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enter administrative PIN or passkey to unlock control
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4" />
            <span>Invalid Passkey. Access Denied.</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (Default: loxxy2026)"
              className="w-full px-4 py-3 rounded-xl bg-dark-850 border border-slate-700 text-center text-white placeholder-slate-500 font-mono tracking-widest text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Authorize Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-[11px] font-mono text-slate-500">
          Protected by Loxxy Cryptographic Session Manager
        </div>
      </div>
    </div>
  );
}
