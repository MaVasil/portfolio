import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, ArrowUpRight, Lock } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-nav py-3.5 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-orange-500/20">
            AV
          </span>
          <span>{portfolioData.personal.shortName}.dev</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#projects" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Projects</a>
          <a href="#consistency-lab" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-orange-600 font-semibold flex items-center gap-1">
            <span>GATE 2027</span>
          </a>
          <a href="#capabilities" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Capabilities</a>
          <a href="#experience" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Experience</a>
          <a href="#achievements" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Achievements</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Contact</a>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-500 hover:text-slate-900 glass-card rounded-xl transition-all"
            title="Admin Command Center"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenResume}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Résumé</span>
          </button>
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-card border-t border-slate-200 p-6 shadow-xl md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 hover:text-orange-600 py-1.5"
          >
            Projects
          </a>
          <a
            href="#consistency-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-orange-600 font-semibold py-1.5"
          >
            GATE 2027 Consistency Lab
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 hover:text-orange-600 py-1.5"
          >
            Capabilities
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 hover:text-orange-600 py-1.5"
          >
            Experience
          </a>
          <a
            href="#achievements"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 hover:text-orange-600 py-1.5"
          >
            Achievements
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 hover:text-orange-600 py-1.5"
          >
            Contact
          </a>
          <div className="pt-2 border-t border-slate-200 flex gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenResume(); }}
              className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Résumé</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
