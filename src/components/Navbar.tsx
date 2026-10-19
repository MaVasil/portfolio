import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, ArrowUpRight, Lock } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

const NAV_LINKS = [
  { label: 'Projects',      href: '#projects' },
  { label: 'GATE 2027',     href: '#consistency-lab', highlight: true },
  { label: 'Capabilities',  href: '#capabilities' },
  { label: 'Experience',    href: '#experience' },
  { label: 'Achievements',  href: '#achievements' },
  { label: 'Contact',       href: '#contact' },
];

const SECTION_IDS = ['projects', 'consistency-lab', 'capabilities', 'experience', 'achievements', 'contact'];
const NAVBAR_HEIGHT = 72; // px offset for fixed header

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Update scrolled state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionVisibility: Record<string, number> = {};

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          sectionVisibility[id] = entry.intersectionRatio;
          // Pick the section with the highest visible ratio
          const topSection = Object.entries(sectionVisibility)
            .sort(([, a], [, b]) => b - a)[0];
          if (topSection && topSection[1] > 0) setActiveSection(topSection[0]);
        },
        { threshold: [0, 0.25, 0.5], rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px` }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    smoothScrollTo(id);
    setMobileMenuOpen(false);
  }, []);

  const isActive = (href: string) => activeSection === href.replace('#', '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3.5 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

        {/* Wordmark */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-orange-500/20">
            AV
          </span>
          <span>{portfolioData.personal.shortName}.dev</span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {NAV_LINKS.map(({ label, href, highlight }) => (
            <a
              key={href}
              href={href}
              onClick={e => handleNavClick(e, href)}
              className={`relative whitespace-nowrap shrink-0 transition-colors duration-200 ${
                isActive(href)
                  ? 'text-orange-600 font-semibold'
                  : highlight
                  ? 'text-orange-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenAdmin}
            className="p-2 text-slate-500 hover:text-slate-900 glass-card rounded-xl transition-all"
            title="Admin Command Center"
          >
            <Lock className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenResume}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Résumé</span>
          </motion.button>
          <motion.a
            whileTap={{ scale: 0.94 }}
            href="#contact"
            onClick={e => handleNavClick(e, '#contact')}
            className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.a>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="absolute top-full left-0 right-0 glass-card border-t border-slate-200 p-6 shadow-xl md:hidden flex flex-col gap-4"
          >
            {NAV_LINKS.map(({ label, href, highlight }) => (
              <a
                key={href}
                href={href}
                onClick={e => handleNavClick(e, href)}
                className={`text-sm font-medium py-1.5 transition-colors ${
                  isActive(href) || highlight
                    ? 'text-orange-600 font-semibold'
                    : 'text-slate-700 hover:text-orange-600'
                }`}
              >
                {label}
              </a>
            ))}
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
