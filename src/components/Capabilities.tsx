import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Code2, Server, Cpu } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code2 className="w-5 h-5 text-orange-600" />;
      case 1:
        return <Server className="w-5 h-5 text-orange-600" />;
      case 2:
        return <Cpu className="w-5 h-5 text-orange-600" />;
      default:
        return <Code2 className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <section id="capabilities" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Technical Expertise</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Core Competencies & Stack
          </h2>
          <p className="text-sm text-slate-600">
            A comprehensive foundation in computer science fundamentals paired with modern production-grade frameworks and developer tooling.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioData.skillsGroups.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-slate-200/80 shadow-lg shadow-slate-200/40"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                    {getIcon(idx)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{group.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Verified Proficiency</span>
                <span className="text-slate-900 font-semibold">Production Ready</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
