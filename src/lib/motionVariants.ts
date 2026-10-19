/**
 * Shared Framer Motion variants used across all sections.
 * Import these to keep animation behaviour consistent site-wide.
 */

import type { Variants } from 'framer-motion';

// ---------- Viewport defaults ----------
export const VIEWPORT = { once: true, margin: '-80px 0px' } as const;

// ---------- Base entrance ----------
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ---------- Staggered container ----------
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0 } },
};

// ---------- Section header (label + title) ----------
export const sectionHeader: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ---------- Card hover spring ----------
export const cardHoverProps = {
  whileHover: { y: -4, scale: 1.015, transition: { type: 'spring' as const, stiffness: 350, damping: 22 } },
  whileTap:   { scale: 0.98, transition: { duration: 0.15 } },
};

// ---------- Button press ----------
export const buttonTap = {
  whileTap: { scale: 0.94, transition: { duration: 0.12 } },
};
