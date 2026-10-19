import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData, Project } from '../data/portfolioData';

interface FeaturedProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onSelectProject }) => {
  const featured = portfolioData.projects.filter(p => p.featured);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Featured Engineering Works</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Production Systems & Hackathon Milestones
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Explore core projects highlighting full-stack architecture, machine learning pipeline integration, and responsive web systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              onClick={() => onSelectProject(project)}
              className="glass-card rounded-2xl p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 cursor-pointer group border border-slate-200/80"
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
                  <span className="font-semibold text-slate-700">{project.metrics}</span>
                  <span className="font-semibold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
