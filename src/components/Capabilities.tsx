import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Code2, Server, Cpu } from 'lucide-react';
import { fadeUp, staggerContainer, sectionHeader, VIEWPORT, cardHoverProps } from '../lib/motionVariants';

export const Capabilities: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Code2 className="w-5 h-5 text-orange-600" />;
      case 1: return <Server className="w-5 h-5 text-orange-600" />;
      case 2: return <Cpu className="w-5 h-5 text-orange-600" />;
      default: return <Code2 className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <section id="capabilities" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Technical Expertise</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Core Competencies &amp; Stack
          </h2>
          <p className="text-sm text-slate-600">
            A comprehensive foundation in computer science fundamentals paired with modern production-grade frameworks and developer tooling.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {portfolioData.skillsGroups.map((group, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              {...cardHoverProps}
              className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-slate-200/80 shadow-lg shadow-slate-200/40 cursor-default"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center origin-center"
                  >
                    {getIcon(idx)}
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900">{group.category}</h3>
                </div>

                <motion.div
                  variants={staggerContainer}
                  className="flex flex-wrap gap-2"
                >
                  {group.skills.map((skill, sIdx) => (
                    <motion.span
                      key={sIdx}
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: sIdx * 0.04, duration: 0.3 }}
                      whileHover={{ scale: 1.07, y: -2 }}
                      className="text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-default"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{skill}</span>
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Verified Proficiency</span>
                <span className="text-slate-900 font-semibold">Production Ready</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
