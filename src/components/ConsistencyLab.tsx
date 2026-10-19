import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Flame, CheckCircle2, Code2, Sparkles, BookOpen } from 'lucide-react';
import { fetchGateSubjects, fetchOverallDsa, GateSubjectItem, OverallDsaData } from '../lib/portfolioService';

export const ConsistencyLab: React.FC = () => {
  // GATE 2027 target date: Feb 6, 2027 09:00:00 IST (+05:30)
  const targetDate = new Date('2027-02-06T09:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [gateCsSubjects, setGateCsSubjects] = useState<GateSubjectItem[]>([]);
  const [gateDaSubjects, setGateDaSubjects] = useState<GateSubjectItem[]>([]);
  const [overallDsa, setOverallDsa] = useState<OverallDsaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchGateSubjects(), fetchOverallDsa()])
      .then(([gateRes, dsaRes]) => {
        if (!isMounted) return;
        setGateCsSubjects(gateRes.cs);
        setGateDaSubjects(gateRes.da);
        setOverallDsa(dsaRes);
      })
      .catch((err) => console.error('Error fetching Consistency Lab data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <section id="consistency-lab" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>The Consistency Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            GATE 2027 CSE & DA Preparation Dashboard
          </h2>
          <p className="text-sm text-slate-600">
            Real-time progress tracking for GATE 2027 examination tracks and overall algorithmic problem-solving rigor.
          </p>
        </motion.div>

        {/* Dynamic Overall DSA Numerical Progress Card */}
        {overallDsa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-xl mb-12 bg-white/95"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider block">Algorithmic Problem Solving</span>
                  <h3 className="text-2xl font-black text-slate-900">Overall DSA Progress Tracker</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-orange-600 font-mono">
                  {overallDsa.solved} <span className="text-sm text-slate-400 font-normal">/ {overallDsa.target}</span>
                </span>
                <span className="block text-xs text-slate-500 font-medium">Questions Solved ({overallDsa.percentage}% Target)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Progress: {overallDsa.solved} Questions Solved</span>
                <span>Remaining: {overallDsa.remaining} Questions</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, overallDsa.percentage)}%` }}
                />
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Target Questions</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{overallDsa.target}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Solved Total</span>
                <span className="font-mono font-bold text-orange-600 text-sm">{overallDsa.solved}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Difficulty Breakdown</span>
                <span className="font-mono font-semibold text-slate-700 text-xs">
                  {overallDsa.easy}E · {overallDsa.medium}M · {overallDsa.hard}H
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Platform</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{overallDsa.platform}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* High-Contrast Premium Black Countdown Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs font-semibold text-orange-400 tracking-wider uppercase mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Target Examination Date: 6 February 2027 (09:00 AM IST)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">GATE 2027 — Examination Countdown</h3>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-4 py-2 rounded-2xl text-xs font-semibold">
              ACE Engineering Academy Full Merit Scholar
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-inner">
              <span className="block text-4xl sm:text-5xl font-black text-orange-500 tracking-tight">{timeLeft.days}</span>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest mt-2 block">Days</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-inner">
              <span className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{timeLeft.hours}</span>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest mt-2 block">Hours</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-inner">
              <span className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{timeLeft.minutes}</span>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest mt-2 block">Minutes</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-inner">
              <span className="block text-4xl sm:text-5xl font-black text-orange-500 tracking-tight">{timeLeft.seconds}</span>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest mt-2 block">Seconds</span>
            </div>
          </div>
        </motion.div>

        {/* Side-by-Side GATE CS & GATE DA Dashboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GATE CS Dashboard */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-xl flex flex-col justify-between bg-white/90">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Examination Track 01</span>
                  <h3 className="text-xl font-black text-slate-900">GATE CS — Track Progress</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs font-mono">
                  {gateCsSubjects.length > 0
                    ? `${Math.round(gateCsSubjects.reduce((acc, s) => acc + s.completionPercentage, 0) / gateCsSubjects.length)}%`
                    : '100%'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {gateCsSubjects.map((subject) => (
                  <div key={subject.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block">{subject.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target: {subject.targetPyqs} · Remaining: {subject.remainingPyqs}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-500 font-medium hidden sm:inline">{subject.revisionStatus}</span>
                      <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-orange-600 font-semibold">
                        {subject.solvedPyqs} / {subject.targetPyqs}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Track Subjects: {gateCsSubjects.length} / 10 Managed</span>
              <span className="text-emerald-600 font-semibold">Active Track</span>
            </div>
          </div>

          {/* GATE DA Dashboard */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-xl flex flex-col justify-between bg-white/90">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Examination Track 02</span>
                  <h3 className="text-xl font-black text-slate-900">GATE DA — Track Progress</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                  {gateDaSubjects.length > 0
                    ? `${Math.round(gateDaSubjects.reduce((acc, s) => acc + s.completionPercentage, 0) / gateDaSubjects.length)}%`
                    : '100%'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {gateDaSubjects.map((subject) => (
                  <div key={subject.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block">{subject.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target: {subject.targetPyqs} · Remaining: {subject.remainingPyqs}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-500 font-medium hidden sm:inline">{subject.revisionStatus}</span>
                      <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-blue-600 font-semibold">
                        {subject.solvedPyqs} / {subject.targetPyqs}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Track Subjects: {gateDaSubjects.length} / 7 Managed</span>
              <span className="text-emerald-600 font-semibold">Active Track</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
