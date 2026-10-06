import { getSettingsAsync } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecruitmentForm from '@/components/discord/RecruitmentForm';
import Link from 'next/link';
import { MessageSquare, Users, Shield, Lock, ExternalLink, Sparkles, CheckCircle2, ChevronRight, Swords } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DiscordPage() {
  const settings = await getSettingsAsync();
  const isEnabled = settings.discordPageEnabled;

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* If Admin has toggled Discord page OFF */}
        {!isEnabled ? (
          <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-dark-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-2xl">
              <Lock className="w-10 h-10 text-brand-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
              Recruitment Standby
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Public recruitment applications and the official community Discord invite are currently placed in standby by Loxxy team administration. Please check back later or view our active roster.
            </p>
            <div className="pt-4">
              <Link
                href="/roster"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-glow-sm"
              >
                <span>Browse Active Roster</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Team Communications Hub</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
                JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">COMMUNITY</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400">
                Enter the official Loxxy Discord to arrange scrims, discuss PvP meta, participate in community events, or apply for roster recruitment.
              </p>
            </div>

            {/* Big Discord Server Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-dark-900 to-cyan-950/60 border border-indigo-500/40 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-white">Loxxy Official Guild</h2>
                    <div className="text-xs font-mono text-cyan-300">Verified Esports Community</div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Join hundreds of competitive duelists, tournament organizers, and clan supporters. Get announcements about roster promotions and match streams.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    2,400+ Members Online
                  </span>
                  <span>•</span>
                  <span>24/7 Matchmaking</span>
                  <span>•</span>
                  <span>Custom Tier Roles</span>
                </div>
              </div>

              {settings.discordInvite && (
                <a
                  href={settings.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-glow-cyan transition-all flex items-center gap-2 group"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Accept Invite</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>

            {/* Recruitment Form Section */}
            {settings.recruitmentEnabled && (
              <div id="apply" className="pt-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-3xl font-display font-black text-white">
                    Apply For The <span className="text-brand-400">Loxxy Roster</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Fill out the athlete application below. Our management evaluates combat clips, high-tier duel records, and communication synergy.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <RecruitmentForm />
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      <Footer settings={settings} />
    </div>
  );
}
