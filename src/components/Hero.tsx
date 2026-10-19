import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Github, Linkedin, Mail, Award, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { fetchOverallDsa } from '../lib/portfolioService';
import { fadeUp, fadeRight, scaleIn, staggerContainer, buttonTap } from '../lib/motionVariants';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const [dsaSolved, setDsaSolved] = useState<number>(187);

  useEffect(() => {
    fetchOverallDsa()
      .then(res => setDsaSolved(res.solved))
      .catch(() => {});
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient glowing orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-orange-500/10 top-20 -left-40 float-y" />
      <div className="glow-orb w-[450px] h-[450px] bg-blue-500/15 top-40 -right-20 float-x" />

      {/* Floating accent rings (decorative, reduced-motion-safe via CSS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-orange-200/20 opacity-50 float-y"
        style={{ animationDuration: '10s' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-blue-200/20 opacity-40 float-x"
        style={{ animationDuration: '13s' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* ── Left Column ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Kicker badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Computer Science Engineering @ CBIT Hyderabad</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance"
            >
              I build software that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 animate-gradient-text">
                solves real problems
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              Hi, I'm <strong className="text-slate-900 font-semibold">{portfolioData.personal.name}</strong>. A passionate CS
              undergraduate with a <strong className="text-slate-900 font-semibold">9.45 CGPA</strong>, specializing in scalable
              full-stack applications, machine learning systems, and robust backend architecture.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
              <motion.a
                {...buttonTap}
                href="#projects"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.a>
              <motion.button
                {...buttonTap}
                onClick={onOpenResume}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 glass-card hover:bg-white/90 rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Download Résumé</span>
              </motion.button>
              <motion.a
                {...buttonTap}
                href="#contact"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-100/80 rounded-2xl transition-all"
              >
                Contact Me
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4 text-slate-500 text-sm">
              {[
                { href: portfolioData.personal.github, label: 'GitHub Profile', icon: <Github className="w-4 h-4" />, text: 'GitHub' },
                { href: portfolioData.personal.linkedin, label: 'LinkedIn Profile', icon: <Linkedin className="w-4 h-4" />, text: 'LinkedIn' },
                { href: `mailto:${portfolioData.personal.email}`, label: 'Email Address', icon: <Mail className="w-4 h-4" />, text: portfolioData.personal.email },
              ].map(({ href, label, icon, text }) => (
                <motion.a
                  key={href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-2.5 glass-card hover:text-slate-900 rounded-xl transition-colors flex items-center gap-2"
                  aria-label={label}
                >
                  {icon}
                  <span className="text-xs font-medium">{text}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Profile Card ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 28px 56px -8px rgba(234,88,12,0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="glass-card w-full rounded-3xl p-8 relative overflow-hidden border border-white/80 shadow-xl shadow-slate-300/40"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  initial={{ rotate: -8, scale: 0.85 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/30"
                >
                  AV
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Mohammed Abdul Vasil</h2>
                  <p className="text-xs text-slate-500 font-medium">CBIT CSE · Batch of 2028</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-200/60">
                {[
                  { label: 'Degree', value: 'B.E. Computer Science', highlight: false },
                  { label: 'Current CGPA', value: '9.45 / 10.0', highlight: true },
                  { label: 'Diploma CGPA', value: '9.91 / 10.0', highlight: false },
                  { label: 'Hackathon Honor', value: 'SIH Top 20 / 200', highlight: false },
                  { label: 'DSA Milestone', value: `${dsaSolved}+ LeetCode Solved`, highlight: false },
                ].map(({ label, value, highlight }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.07, duration: 0.4 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-semibold ${highlight ? 'text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60' : 'text-slate-900'}`}>
                      {value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>GATE 2027 Full Merit Scholar</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Active</span>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>

        {/* KPI row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200/80"
        >
          {portfolioData.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-center cursor-default"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
              <span className="text-xs font-medium text-slate-500 mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
