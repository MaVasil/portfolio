import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Professional Timeline</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Experience & Leadership
          </h2>
          <p className="text-sm text-slate-600">
            Active leadership roles in technical communities and industrial software engineering experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {portfolioData.experiences.map((exp) => (
            <div
              key={exp.id}
              className="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-lg shadow-slate-200/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-600" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                  <p className="text-sm font-semibold text-orange-600">{exp.organization}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {exp.description}
              </p>

              <div className="space-y-2 mb-6">
                {exp.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/60">
                {exp.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
