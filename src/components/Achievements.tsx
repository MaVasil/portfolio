import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Award, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Proof of Growth</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Certifications & Achievements
          </h2>
          <p className="text-sm text-slate-600">
            Academic distinction, competitive programming rigor, and professional industry certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.certifications.map((cert) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-orange-600">{cert.issuer}</span>
                <span className="text-slate-400 font-mono">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Academic summary banner */}
        <div className="mt-16 glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl bg-gradient-to-r from-white via-orange-50/30 to-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Academic Track Record</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Chaitanya Bharathi Institute of Technology (CBIT)</h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Consistently maintaining academic excellence with a <strong className="text-slate-900 font-semibold">9.45 CGPA</strong> in B.E. Computer Science Engineering, preceded by a <strong className="text-slate-900 font-semibold">9.91 CGPA</strong> diploma and <strong className="text-slate-900 font-semibold">97%</strong> in Class X.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <div className="bg-white/90 border border-slate-200 px-6 py-4 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-black text-orange-600">9.45</span>
              <span className="text-xs text-slate-500 font-medium">B.E. CSE CGPA</span>
            </div>
            <div className="bg-white/90 border border-slate-200 px-6 py-4 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-black text-slate-900">9.91</span>
              <span className="text-xs text-slate-500 font-medium">Diploma CGPA</span>
            </div>
            <div className="bg-white/90 border border-slate-200 px-6 py-4 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-black text-slate-900">140+</span>
              <span className="text-xs text-slate-500 font-medium">LeetCode Solved</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
