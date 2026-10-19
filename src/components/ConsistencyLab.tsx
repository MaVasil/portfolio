import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, BookOpen, Flame, Award, CheckCircle2, TrendingUp, Calendar, Layers } from 'lucide-react';

export const ConsistencyLab: React.FC = () => {
  // GATE 2027 target date: Feb 6, 2027 09:00:00 IST (+05:30)
  const targetDate = new Date('2027-02-06T09:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  // GATE CS Subjects (100% syllabus completion)
  const gateCsSubjects = [
    { name: "Engineering Mathematics", completion: 100, revision: "Cycle 2 Completed", pyqs: "450+ Solved" },
    { name: "Digital Logic", completion: 100, revision: "Cycle 2 Completed", pyqs: "320+ Solved" },
    { name: "Computer Organization & Architecture", completion: 100, revision: "Cycle 2 Completed", pyqs: "380+ Solved" },
    { name: "Programming and Data Structures", completion: 100, revision: "Cycle 3 Completed", pyqs: "500+ Solved" },
    { name: "Algorithms", completion: 100, revision: "Cycle 3 Completed", pyqs: "550+ Solved" },
    { name: "Theory of Computation", completion: 100, revision: "Cycle 2 Completed", pyqs: "400+ Solved" },
    { name: "Compiler Design", completion: 100, revision: "Cycle 2 Completed", pyqs: "300+ Solved" },
    { name: "Operating Systems", completion: 100, revision: "Cycle 3 Completed", pyqs: "480+ Solved" },
    { name: "Databases", completion: 100, revision: "Cycle 3 Completed", pyqs: "450+ Solved" },
    { name: "Computer Networks", completion: 100, revision: "Cycle 2 Completed", pyqs: "420+ Solved" }
  ];

  // GATE DA Subjects (100% syllabus completion)
  const gateDaSubjects = [
    { name: "Probability and Statistics", completion: 100, revision: "Cycle 2 Completed", pyqs: "400+ Solved" },
    { name: "Linear Algebra", completion: 100, revision: "Cycle 2 Completed", pyqs: "350+ Solved" },
    { name: "Calculus and Optimization", completion: 100, revision: "Cycle 2 Completed", pyqs: "300+ Solved" },
    { name: "Programming, Data Structures & Algorithms", completion: 100, revision: "Cycle 3 Completed", pyqs: "500+ Solved" },
    { name: "Database Management & Warehousing", completion: 100, revision: "Cycle 2 Completed", pyqs: "320+ Solved" },
    { name: "Machine Learning", completion: 100, revision: "Cycle 3 Completed", pyqs: "600+ Solved" },
    { name: "Artificial Intelligence", completion: 100, revision: "Cycle 3 Completed", pyqs: "450+ Solved" }
  ];

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
            Full syllabus coverage completed for both GATE CS and GATE DA. Current active phase focuses on advanced revision cycles, PYQs, and mock tests.
          </p>
        </motion.div>

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
                  <h3 className="text-xl font-black text-slate-900">GATE CS — Syllabus Complete: 100%</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-sm">
                  100%
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {gateCsSubjects.map((subject, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-500 font-medium hidden sm:inline">{subject.revision}</span>
                      <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-orange-600 font-semibold">{subject.pyqs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Subjects: 10 / 10 Completed</span>
              <span className="text-emerald-600 font-semibold">Status: Active Revision</span>
            </div>
          </div>

          {/* GATE DA Dashboard */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-xl flex flex-col justify-between bg-white/90">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Examination Track 02</span>
                  <h3 className="text-xl font-black text-slate-900">GATE DA — Syllabus Complete: 100%</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm">
                  100%
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {gateDaSubjects.map((subject, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-500 font-medium hidden sm:inline">{subject.revision}</span>
                      <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-blue-600 font-semibold">{subject.pyqs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Subjects: 7 / 7 Completed</span>
              <span className="text-emerald-600 font-semibold">Status: Active Revision</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
