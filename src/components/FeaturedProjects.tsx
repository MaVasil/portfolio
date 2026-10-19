import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { portfolioData, Project } from '../data/portfolioData';
import { fadeUp, staggerContainer, sectionHeader, VIEWPORT, cardHoverProps } from '../lib/motionVariants';

interface FeaturedProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onSelectProject }) => {
  const featured = portfolioData.projects.filter(p => p.featured);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <motion.div variants={sectionHeader}>
            <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Featured Engineering Works</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Production Systems &amp; Hackathon Milestones
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-slate-600 max-w-md">
            Explore core projects highlighting full-stack architecture, machine learning pipeline integration, and responsive web systems.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featured.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              {...cardHoverProps}
              onClick={() => onSelectProject(project)}
              className="glass-card rounded-2xl p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-300/50 transition-shadow duration-300 cursor-pointer group border border-slate-200/80"
            >
              <div>
                {/* Metadata header */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-orange-600">{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium">{project.badge}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 mb-4">{project.subtitle}</p>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-mono text-slate-600 bg-slate-100/80 px-2 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[45%]">{project.metrics}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.liveUrl && (
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
                    )}
                    <span className="font-semibold text-slate-600 group-hover:text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      <span>Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
