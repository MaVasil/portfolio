import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
            AV
          </span>
          <span className="text-sm font-bold text-slate-900">{portfolioData.personal.name} · Vasil.dev</span>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Mohammed Abdul Vasil. Built with React, Vite, & Three.js.
        </p>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <a href="#projects" className="hover:text-slate-900 transition-colors">Projects</a>
          <a href="#consistency-lab" className="hover:text-slate-900 transition-colors">GATE 2027</a>
          <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Control Room</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
