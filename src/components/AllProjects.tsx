import React, { useState } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { ArrowUpRight, Search, Filter } from 'lucide-react';

interface AllProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const AllProjects: React.FC<AllProjectsProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Full-Stack', 'AI/ML & Python', 'Systems & Cloud'];

  const filteredProjects = portfolioData.projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Engineering Index</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All Projects & Systems
            </h2>
          </div>

          {/* Interactive filter tabs and search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tech or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-slate-500 text-sm">No projects found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-300/40 transition-all cursor-pointer group border border-slate-200/80 bg-white/80"
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
                    <span>Explore details</span>
                    <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
