import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Award, BookOpen } from 'lucide-react';
import { fetchOverallDsa } from '../lib/portfolioService';
import { fadeUp, scaleIn, staggerContainer, sectionHeader, VIEWPORT, cardHoverProps } from '../lib/motionVariants';

export const Achievements: React.FC = () => {
  const [dsaSolved, setDsaSolved] = useState<number>(187);

  useEffect(() => {
    fetchOverallDsa()
      .then(res => setDsaSolved(res.solved))
      .catch(() => {});
  }, []);

  return (
    <section id="achievements" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Proof of Growth</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Certifications &amp; Achievements
          </h2>
          <p className="text-sm text-slate-600">
            Academic distinction, competitive programming rigor, and professional industry certifications.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {portfolioData.certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={fadeUp}
              {...cardHoverProps}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/80 shadow-lg shadow-slate-200/40 cursor-default"
            >
              <div>
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                  className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4 origin-center"
                >
                  <Award className="w-5 h-5 text-orange-600" />
                </motion.div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-orange-600">{cert.issuer}</span>
                <span className="text-slate-400 font-mono">{cert.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Academic summary banner */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-16 glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl bg-gradient-to-r from-white via-orange-50/30 to-white flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Academic Track Record</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Chaitanya Bharathi Institute of Technology (CBIT)</h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Consistently maintaining academic excellence with a <strong className="text-slate-900 font-semibold">9.45 CGPA</strong> in B.E. Computer
              Science Engineering, preceded by a <strong className="text-slate-900 font-semibold">9.91 CGPA</strong> diploma and{' '}
              <strong className="text-slate-900 font-semibold">97%</strong> in Class X.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="flex flex-wrap gap-4 shrink-0"
          >
            {[
              { value: '9.45', label: 'B.E. CSE CGPA', color: 'text-orange-600' },
              { value: '9.91', label: 'Diploma CGPA',  color: 'text-slate-900' },
              { value: `${dsaSolved}+`, label: 'LeetCode Solved', color: 'text-slate-900' },
            ].map(({ value, label, color }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="bg-white/90 border border-slate-200 px-6 py-4 rounded-2xl text-center shadow-sm cursor-default"
              >
                <span className={`block text-2xl font-black ${color}`}>{value}</span>
                <span className="text-xs text-slate-500 font-medium">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
