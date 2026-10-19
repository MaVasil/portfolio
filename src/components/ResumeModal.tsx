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
  const [resumeInfo, setResumeInfo] = useState<{ filename: string; fileSize: string; uploadedAt: string; publicUrl: string } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/resume/latest')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.document) {
            setResumeInfo(data.document);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);

    // Track download event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_download' })
    }).catch(() => {});

    // Initiate genuine PDF download from server / storage endpoint
    try {
      const downloadUrl = '/api/resume/download';
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', resumeInfo?.filename || 'Mohammed_Abdul_Vasil_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      // Fallback to direct public URL if available
      if (resumeInfo?.publicUrl) {
        window.open(resumeInfo.publicUrl, '_blank');
      }
      setDownloading(false);
    }
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
            {resumeInfo && (
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Active PDF: {resumeInfo.filename} ({resumeInfo.fileSize})
              </p>
            )}
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloading ? (
              <span>Downloading PDF...</span>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Downloaded PDF!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official Résumé PDF</span>
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
