'use client';

import React from 'react';
import { NewsItem } from '@/lib/types';
import { Sparkles, Calendar, ArrowRight, Bell } from 'lucide-react';
import Link from 'next/link';

interface LatestNewsSectionProps {
  news: NewsItem[];
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {
  if (!news || news.length === 0) return null;

  return (
    <section className="relative py-24 bg-dark-900/60 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Team Dispatch</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
              LATEST FROM <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">LOXXY</span>
            </h2>
          </div>

          <Link
            href="/matches"
            className="text-xs font-mono uppercase text-cyan-400 hover:underline flex items-center gap-1 font-bold"
          >
            <span>View Match Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-dark-850/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan/20 flex flex-col justify-between"
            >
              {item.imageUrl && (
                <div className="relative h-48 bg-dark-950 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100 pixelated"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-850 to-transparent opacity-80" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-dark-900/90 border border-slate-700 text-cyan-300 text-[10px] font-mono uppercase font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>{item.date}</span>
                </div>

                <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/discord"
                  className="w-full py-2 rounded-xl bg-dark-900 hover:bg-slate-800 text-slate-300 text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1 transition-colors border border-slate-800"
                >
                  <span>Discuss in Discord</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
