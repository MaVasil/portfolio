import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData, Project } from '../data/portfolioData';
import { ArrowUpRight, Search, ExternalLink } from 'lucide-react';
import { fadeUp, staggerContainer, sectionHeader, VIEWPORT, cardHoverProps } from '../lib/motionVariants';

interface AllProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const AllProjects: React.FC<AllProjectsProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Full-Stack', 'AI/ML & Python', 'Systems & Cloud'];

  const filteredProjects = portfolioData.projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            variants={sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Engineering Index</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All Projects &amp; Systems
            </h2>
          </motion.div>

          {/* Filter controls */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tech or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full sm:w-60 transition-shadow"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    activeCategory === cat ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 bg-slate-900 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 glass-card rounded-2xl"
            >
              <p className="text-slate-500 text-sm">No projects found matching your search criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  {...cardHoverProps}
                  onClick={() => onSelectProject(project)}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-300/40 transition-shadow duration-300 cursor-pointer group border border-slate-200/80 bg-white/80"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-orange-600">{project.category}</span>
                      <span className="font-medium text-slate-400">{project.metrics}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200/80 transition-all shadow-xs"
                          title={`Open live demo in new tab`}
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 font-normal">Architecture</span>
                      )}
                      <span className="text-slate-700 group-hover:text-orange-600 flex items-center gap-1 transition-colors">
                        <span>Details</span>
                        <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
