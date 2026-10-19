import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Lock } from 'lucide-react';
import { fadeUp, VIEWPORT } from '../lib/motionVariants';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="py-12 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
            AV
          </span>
          <span className="text-sm font-bold text-slate-900">{portfolioData.personal.name} · Vasil.dev</span>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Mohammed Abdul Vasil. Built with React, Vite, &amp; Three.js.
        </p>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          {[
            { href: '#projects', label: 'Projects' },
            { href: '#consistency-lab', label: 'GATE 2027' },
            { href: '#capabilities', label: 'Capabilities' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={e => {
                e.preventDefault();
                document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {label}
            </a>
          ))}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Control Room</span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
};
