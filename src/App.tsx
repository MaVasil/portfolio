import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { AllProjects } from './components/AllProjects';
import { Capabilities } from './components/Capabilities';
import { ConsistencyLab } from './components/ConsistencyLab';
import { Experience } from './components/Experience';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistant } from './components/AiAssistant';
import { ThreeBackground } from './components/ThreeBackground';
import { Project } from './data/portfolioData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Seamless Three.js Background Constellation & Particles */}
      <ThreeBackground />

      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />
      
      <main className="relative z-10">
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <FeaturedProjects onSelectProject={(project) => setSelectedProject(project)} />
        <ConsistencyLab />
        <AllProjects onSelectProject={(project) => setSelectedProject(project)} />
        <Capabilities />
        <Experience />
        <Achievements />
        <Contact />
      </main>

      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* Modals & AI Assistant */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}
      <AiAssistant />
    </div>
  );
}
