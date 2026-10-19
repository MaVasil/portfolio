import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);

    // Track download event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_download' })
    }).catch(() => {});

    // Generate real downloadable résumé file blob
    setTimeout(() => {
      const resumeContent = `
MOHAMMED ABDUL VASIL (MD VASIL)
Computer Science Engineering Student & Software Engineer
Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad
Email: mdvasil07@gmail.com | Phone: +91-9502056930
LinkedIn: linkedin.com/in/mohammed-abdul-vasil | GitHub: github.com/Ma Vasil

--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
- Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad
  B.E. Computer Science Engineering (Expected May 2028)
  CGPA: 9.45 / 10.0 (GATE 2027 Full Merit Scholar - ACE Engineering Academy)
- Diploma in Computer Engineering
  CGPA: 9.91 / 10.0 | Class X: 97%

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
- Languages & Core CS: Python, Java, C, C++, JavaScript, SQL, DSA, OOP, DBMS, OS, Distributed Systems, Microservices, RESTful APIs, System Design, Concurrency.
- Web & Frontend: MERN Stack, React.js, FastAPI, HTML/CSS, Tailwind CSS.
- AI, Tools & DevOps: Generative AI, Scikit-Learn, NumPy, Pandas, Git, GitHub, VS Code, Supabase, PostgreSQL, Linux, Prompt Engineering.

--------------------------------------------------------------------------------
PROJECTS
--------------------------------------------------------------------------------
1. TrainETA Dynamic Railway Intelligence (Smart India Hackathon - Top 20 of 200)
   Tech: Python, FastAPI, Supabase, Scikit-Learn
   ML-powered dynamic ETA prediction system fusing real-time telemetry with historical delay datasets.

2. Smart Inventory Management & Storage System
   Tech: React.js, Node.js, MongoDB, Express.js
   Enterprise-grade inventory dashboard with real-time stock monitoring and secure RESTful APIs.

3. VMEDHA Club Collaboration Portal
   Tech: React.js, Tailwind CSS, Vite
   Centralized portal for CBIT technical club activities and workshop registrations.

--------------------------------------------------------------------------------
EXPERIENCE & LEADERSHIP
--------------------------------------------------------------------------------
- CBIT Open Source Community (COSC) | Core Contributor (Jan 2026 – Aug 2026)
- VMEDHA (CBIT Technical Club) | Executive Board Member (Sept 2025 – Aug 2026)
- Design Tech Solutions | Industrial Training Intern (Nov 2024 – May 2025)
      `;

      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Mohammed_Abdul_Vasil_Resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-card w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl p-8 border border-white/80 shadow-2xl relative bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Curriculum Vitae</div>
            <h2 className="text-2xl font-bold text-slate-900">{portfolioData.personal.name}</h2>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {downloading ? (
              <span>Generating Résumé File...</span>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Latest Résumé</span>
              </>
            )}
          </button>
        </div>

        {/* Résumé Content Preview */}
        <div className="py-6 space-y-6 text-slate-700 text-sm">
          
          {/* Contact Strip */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span>{portfolioData.personal.email}</span>
            <span>·</span>
            <span>{portfolioData.personal.phone}</span>
            <span>·</span>
            <span>{portfolioData.personal.location}</span>
            <span>·</span>
            <span>{portfolioData.personal.linkedin}</span>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Education</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad</span>
                  <span>Expected May 2028</span>
                </div>
                <div className="text-xs text-orange-600 font-medium">B.E. Computer Science Engineering · CGPA: 9.45 / 10.0</div>
                <p className="text-xs text-slate-600 mt-1">Relevant Coursework: Data Structures & Algorithms, OOP, Operating Systems, DBMS, Distributed Systems, AI/ML.</p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Diploma in Computer Engineering</span>
                  <span>CGPA: 9.91 / 10.0</span>
                </div>
                <div className="text-xs text-slate-500">Class X: 97%</div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Technical Skills</h3>
            <div className="space-y-2 text-xs">
              <div><strong className="text-slate-900">Languages & Core:</strong> Python, Java, C, C++, JavaScript, SQL, DSA, OOP, DBMS, OS, Distributed Systems, Microservices, RESTful APIs, System Design, Concurrency</div>
              <div><strong className="text-slate-900">Web & Frontend:</strong> MERN Stack, React.js, FastAPI, HTML/CSS, Tailwind CSS</div>
              <div><strong className="text-slate-900">AI, Tools & DevOps:</strong> Generative AI, Scikit-Learn, NumPy, Pandas, Git, GitHub, VS Code, Supabase, PostgreSQL, Linux, Prompt Engineering</div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Experience & Leadership</h3>
            <div className="space-y-4">
              {portfolioData.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role} — {exp.organization}</span>
                    <span className="text-xs text-slate-500 font-normal">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Synced with Supabase Storage Bucket (`resumes`)</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
