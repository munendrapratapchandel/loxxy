'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Trophy, Swords, Crown, Users, Target, Flame, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { DominanceStat } from '@/lib/types';

interface DominanceSectionProps {
  stats: DominanceStat[];
}

function CounterNumber({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1600; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={elementRef} className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
      <span className="text-cyan-400">{prefix}</span>
      {count}
      <span className="text-brand-400 font-bold text-3xl sm:text-4xl">{suffix}</span>
    </div>
  );
}

export default function DominanceSection({ stats }: DominanceSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'trophy': return Trophy;
      case 'swords': return Swords;
      case 'crown': return Crown;
      case 'users': return Users;
      case 'target': return Target;
      default: return Flame;
    }
  };

  return (
    <section className="relative py-24 bg-dark-900/40 border-y border-slate-900 overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#8b5cf615_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Competitive Records</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            LOXXY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">DOMINANCE</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Unrivaled combat consistency in Tier-1 Minecraft tournaments. High-ranking statistics updated live from the Admin database.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            return (
              <div
                key={stat.id}
                className="relative group p-8 rounded-3xl bg-dark-850/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan/20 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/30 to-cyan-500/20 border border-slate-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <CounterNumber
                    target={stat.value}
                    suffix={stat.suffix || ''}
                    prefix={stat.prefix || ''}
                  />
                  <h3 className="mt-2 text-base font-display font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-900/40 via-dark-850 to-cyan-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 shrink-0">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Looking to challenge Loxxy in competitive scrims?</div>
              <div className="text-xs text-slate-400">Our match managers organize official high-tier matches weekly.</div>
            </div>
          </div>
          <Link
            href="/discord"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-mono uppercase tracking-wider font-bold transition-all"
          >
            <span>Arrange Match</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
