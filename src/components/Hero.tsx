import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Github, Linkedin, Mail, Award, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient glowing orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-orange-500/10 top-20 -left-40" />
      <div className="glow-orb w-[450px] h-[450px] bg-blue-500/15 top-40 -right-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typographic Hierarchy & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Computer Science Engineering @ CBIT Hyderabad</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              I build software that <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">solves real problems</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Hi, I'm <strong className="text-slate-900 font-semibold">{portfolioData.personal.name}</strong>. A passionate CS undergraduate with a <strong className="text-slate-900 font-semibold">9.45 CGPA</strong>, specializing in scalable full-stack applications, machine learning systems, and robust backend architecture.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={onOpenResume}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 glass-card hover:bg-white/90 rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Download Résumé</span>
              </button>
              <a
                href="#contact"
                className="px-6 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-100/80 rounded-2xl transition-all"
              >
                Contact Me
              </a>
            </div>

            {/* Social Links & Quick Contact */}
            <div className="flex items-center gap-4 pt-4 text-slate-500 text-sm">
              <a
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass-card hover:text-slate-900 rounded-xl transition-colors flex items-center gap-2"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs font-medium">GitHub</span>
              </a>
              <a
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass-card hover:text-slate-900 rounded-xl transition-colors flex items-center gap-2"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-xs font-medium">LinkedIn</span>
              </a>
              <a
                href={`mailto:${portfolioData.personal.email}`}
                className="p-2.5 glass-card hover:text-slate-900 rounded-xl transition-colors flex items-center gap-2"
                aria-label="Email Address"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs font-medium">{portfolioData.personal.email}</span>
              </a>
            </div>

          </motion.div>

          {/* Right Column: Clean Professional Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="glass-card w-full rounded-3xl p-8 relative overflow-hidden border border-white/80 shadow-xl shadow-slate-300/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/30">
                  AV
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Mohammed Abdul Vasil</h2>
                  <p className="text-xs text-slate-500 font-medium">CBIT CSE · Batch of 2028</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Degree</span>
                  <span className="font-semibold text-slate-900">B.E. Computer Science</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Current CGPA</span>
                  <span className="font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">9.45 / 10.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Diploma CGPA</span>
                  <span className="font-semibold text-slate-900">9.91 / 10.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hackathon Honor</span>
                  <span className="font-semibold text-slate-900">SIH Top 20 / 200</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">DSA Milestone</span>
                  <span className="font-semibold text-slate-900">140+ LeetCode Solved</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>GATE 2027 Full Merit Scholar</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Active</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Full-width 4-column KPI / Stats row below hero split */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200/80"
        >
          {portfolioData.stats.map((stat, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-center hover:scale-105 transition-transform">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
              <span className="text-xs font-medium text-slate-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
