import React, { useState, useEffect, useRef } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { testSupabaseConnection } from '../lib/supabase';
import { 
  Lock, LogOut, LayoutDashboard, FolderGit2, Award, Briefcase, FileText, 
  CheckCircle2, Plus, Trash2, Edit3, Save, X, BarChart3, ShieldCheck, 
  Upload, Cloud, Code, Mail, AlertCircle, RefreshCw, ExternalLink, Download 
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('mdvasil07@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'dsa' | 'gate' | 'contacts' | 'projects' | 'analytics'>('overview');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    pageViews: 0,
    uniqueVisitors: 0,
    resumeDownloads: 0,
    aiInteractions: 0,
    projectClicks: {}
  });

  // Database Connection Diagnostics
  const [connectionStatus, setConnectionStatus] = useState<{ testing: boolean; connected?: boolean; message?: string }>({ testing: false });

  // Résumé State
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [resumeError, setResumeError] = useState<string>('');
  const [activeResume, setActiveResume] = useState<any>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Overall DSA State (Numeric Form)
  const [dsaTarget, setDsaTarget] = useState<number>(500);
  const [dsaSolved, setDsaSolved] = useState<number>(187);
  const [dsaAttempted, setDsaAttempted] = useState<number>(210);
  const [dsaEasy, setDsaEasy] = useState<number>(70);
  const [dsaMedium, setDsaMedium] = useState<number>(95);
  const [dsaHard, setDsaHard] = useState<number>(22);
  const [dsaPlatform, setDsaPlatform] = useState<string>('LeetCode');
  const [dsaUpdatedAt, setDsaUpdatedAt] = useState<string>('');
  const [dsaSaving, setDsaSaving] = useState(false);
  const [dsaSaveSuccess, setDsaSaveSuccess] = useState(false);
  const [dsaError, setDsaError] = useState<string>('');

  // GATE Subject State (Numeric Form)
  const [gateTrack, setGateTrack] = useState<'CS' | 'DA'>('CS');
  const [gateSubjectsList, setGateSubjectsList] = useState<{ cs: any[]; da: any[] }>({ cs: [], da: [] });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [subjectTargetPyqs, setSubjectTargetPyqs] = useState<number>(500);
  const [subjectSolvedPyqs, setSubjectSolvedPyqs] = useState<number>(450);
  const [subjectAttemptedPyqs, setSubjectAttemptedPyqs] = useState<number>(450);
  const [subjectRevisionRounds, setSubjectRevisionRounds] = useState<number>(2);
  const [subjectNotes, setSubjectNotes] = useState<string>('');
  const [gateSaving, setGateSaving] = useState(false);
  const [gateSaveSuccess, setGateSaveSuccess] = useState(false);
  const [gateError, setGateError] = useState<string>('');

  // Contacts Submissions State
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('vasil_admin_token');
    if (savedToken) {
      fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setAdminToken(savedToken);
            setAdminEmail(data.email || 'mdvasil07@gmail.com');
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('vasil_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('vasil_admin_token');
        });
    }
  }, []);

  // Fetch data on load or tab switch
  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {});

    loadLatestResume();
    loadOverallDsa();
    loadGateSubjects();
  }, []);

  const loadLatestResume = () => {
    fetch('/api/resume/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.document) {
          setActiveResume(data.document);
        }
      })
      .catch(() => {});
  };

  const loadOverallDsa = () => {
    fetch('/api/dsa/overall')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setDsaTarget(Number(data.target) || 500);
          setDsaSolved(Number(data.solved) || 0);
          setDsaAttempted(Number(data.attempted) || Number(data.solved) || 0);
          setDsaEasy(Number(data.easy) || 0);
          setDsaMedium(Number(data.medium) || 0);
          setDsaHard(Number(data.hard) || 0);
          setDsaPlatform(data.platform || 'LeetCode');
          setDsaUpdatedAt(data.updatedAt || '');
        }
      })
      .catch(() => {});
  };

  const loadGateSubjects = () => {
    fetch('/api/gate/subjects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGateSubjectsList({ cs: data.cs || [], da: data.da || [] });
          const currentList = gateTrack === 'CS' ? data.cs : data.da;
          if (currentList && currentList.length > 0 && !selectedSubjectId) {
            populateSubjectForm(currentList[0]);
          }
        }
      })
      .catch(() => {});
  };

  const populateSubjectForm = (sub: any) => {
    setSelectedSubjectId(sub.id);
    setSubjectTargetPyqs(sub.targetPyqs);
    setSubjectSolvedPyqs(sub.solvedPyqs);
    setSubjectAttemptedPyqs(sub.attemptedPyqs || sub.solvedPyqs);
    setSubjectRevisionRounds(sub.revisionRounds || 2);
    setSubjectNotes(sub.notes || '');
  };

  const handleTrackChange = (track: 'CS' | 'DA') => {
    setGateTrack(track);
    const list = track === 'CS' ? gateSubjectsList.cs : gateSubjectsList.da;
    if (list && list.length > 0) {
      populateSubjectForm(list[0]);
    }
  };

  const loadContacts = () => {
    if (!adminToken) return;
    setLoadingContacts(true);
    fetch('/api/admin/contacts', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.submissions) {
          setContactSubmissions(data.submissions);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingContacts(false));
  };

  useEffect(() => {
    if (activeTab === 'contacts' && isAuthenticated) {
      loadContacts();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password: passwordInput })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setAdminToken(data.token);
      setAdminEmail(data.admin?.email || emailInput.trim());
      setIsAuthenticated(true);
      localStorage.setItem('vasil_admin_token', data.token);
      handleTestConnection();
    } catch (err: any) {
      setAuthError(err.message || 'Login error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vasil_admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
  };

  const handleTestConnection = async () => {
    setConnectionStatus({ testing: true });
    const res = await testSupabaseConnection();
    setConnectionStatus({ testing: false, connected: res.connected, message: res.message });
  };

  // Résumé Upload Handler
  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setResumeError('Validation error: Only PDF documents are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError('Validation error: File size exceeds the 10 MB limit.');
      return;
    }

    setUploadingResume(true);
    setResumeError('');
    setResumeUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const res = await fetch('/api/admin/resume/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
              filename: file.name,
              mimeType: 'application/pdf',
              base64Data
            })
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Résumé upload failed on server');
          }

          setActiveResume(data.document);
          setResumeUploadSuccess(true);
          setTimeout(() => setResumeUploadSuccess(false), 5000);
        } catch (err: any) {
          setResumeError(err.message || 'Failed to complete upload and metadata write.');
        } finally {
          setUploadingResume(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setResumeError(err.message || 'File read error.');
      setUploadingResume(false);
    }
  };

  // Overall DSA Save Handler
  const handleSaveOverallDsa = async (e: React.FormEvent) => {
    e.preventDefault();
    setDsaSaving(true);
    setDsaError('');
    setDsaSaveSuccess(false);

    if (dsaSolved > dsaTarget) {
      setDsaError('Validation error: Solved questions cannot exceed target questions.');
      setDsaSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/dsa/overall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          target: dsaTarget,
          solved: dsaSolved,
          attempted: dsaAttempted,
          easy: dsaEasy,
          medium: dsaMedium,
          hard: dsaHard,
          platform: dsaPlatform
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save DSA overall progress.');
      }

      setDsaUpdatedAt(data.data.updatedAt);
      setDsaSaveSuccess(true);
      setTimeout(() => setDsaSaveSuccess(false), 4000);
    } catch (err: any) {
      setDsaError(err.message || 'Server error while saving DSA progress');
    } finally {
      setDsaSaving(false);
    }
  };

  // GATE Subject Save Handler
  const handleSaveGateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    setGateSaving(true);
    setGateError('');
    setGateSaveSuccess(false);

    if (subjectSolvedPyqs > subjectTargetPyqs) {
      setGateError('Validation error: Solved PYQs cannot exceed target PYQs.');
      setGateSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/gate/subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: selectedSubjectId,
          target_pyqs: subjectTargetPyqs,
          solved_pyqs: subjectSolvedPyqs,
          attempted_pyqs: subjectAttemptedPyqs,
          revision_rounds: subjectRevisionRounds,
          notes: subjectNotes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update subject progress.');
      }

      setGateSaveSuccess(true);
      loadGateSubjects();
      setTimeout(() => setGateSaveSuccess(false), 4000);
    } catch (err: any) {
      setGateError(err.message || 'Server error while updating GATE subject');
    } finally {
      setGateSaving(false);
    }
  };

  // Unauthenticated Login Modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/80 shadow-2xl relative bg-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black shadow-lg shadow-orange-600/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Command Center</h2>
            <p className="text-xs text-slate-500 mt-1">Verified server authentication required for portfolio administrative control</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="mdvasil07@gmail.com"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {authLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Derived counts for Overall DSA
  const dsaRemaining = Math.max(dsaTarget - dsaSolved, 0);
  const dsaPercentage = dsaTarget > 0 ? Math.min(100, Math.round((dsaSolved / dsaTarget) * 100)) : 0;
  const difficultySum = dsaEasy + dsaMedium + dsaHard;
  const hasDifficultyDiscrepancy = difficultySum > 0 && difficultySum !== dsaSolved;

  // Selected GATE subject
  const currentGateList = gateTrack === 'CS' ? gateSubjectsList.cs : gateSubjectsList.da;
  const currentSubjectObj = currentGateList.find(s => s.id === selectedSubjectId);
  const subjectRemaining = Math.max(subjectTargetPyqs - subjectSolvedPyqs, 0);
  const subjectPercentage = subjectTargetPyqs > 0 ? Math.min(100, Math.round((subjectSolvedPyqs / subjectTargetPyqs) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-in fade-in">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm">
            AV
          </div>
          <div>
            <h1 className="text-sm font-bold">Vasil.dev Command Center</h1>
            <p className="text-[10px] text-slate-400">Authenticated Session: {adminEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 overflow-y-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'resume' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Résumé Manager (PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('dsa')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dsa' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Overall DSA Numbers</span>
          </button>

          <button
            onClick={() => setActiveTab('gate')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'gate' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>GATE CS & DA Subjects</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'contacts' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Submissions</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Live database connection status, telemetry, and quick administrative links.</p>
              </div>

              {/* Database Connection Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                    connectionStatus.connected ? 'bg-emerald-600' : 'bg-slate-900'
                  }`}>
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Supabase PostgreSQL & Storage Status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct connection to verified Supabase project with active buckets.
                    </p>
                    {connectionStatus.message && (
                      <p className={`text-xs mt-1 font-semibold ${connectionStatus.connected ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {connectionStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus.testing}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus.testing ? 'animate-spin' : ''}`} />
                  <span>{connectionStatus.testing ? 'Verifying...' : 'Test Connection'}</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Total Visitors</span>
                  <span className="block text-3xl font-black text-slate-900 mt-2">{analytics.pageViews}</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Real visitor sessions</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Unique Visitors</span>
                  <span className="block text-3xl font-black text-slate-900 mt-2">{analytics.uniqueVisitors}</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Privacy-conscious hash</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Résumé Downloads</span>
                  <span className="block text-3xl font-black text-orange-600 mt-2">{analytics.resumeDownloads}</span>
                  <span className="text-[11px] text-orange-600 font-medium mt-1 inline-block">Direct storage downloads</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">AI Queries</span>
                  <span className="block text-3xl font-black text-blue-600 mt-2">{analytics.aiInteractions}</span>
                  <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">Ask Vasil AI sessions</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RÉSUMÉ MANAGER */}
          {activeTab === 'resume' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Official Résumé Manager</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Upload a PDF résumé to Supabase Storage, persist metadata in PostgreSQL, and publish it live on the portfolio.
                </p>
              </div>

              {resumeError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{resumeError}</span>
                </div>
              )}

              {resumeUploadSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Résumé successfully uploaded to storage and persisted in database!</span>
                </div>
              )}

              {/* Upload Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-orange-600 uppercase">Supabase Storage Bucket: `resumes`</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Upload Replacement Résumé PDF</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                    Public Verified
                  </span>
                </div>

                <div className="border-2 border-dashed border-slate-200 hover:border-orange-500/50 p-8 rounded-2xl text-center space-y-4 transition-colors">
                  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Select an updated PDF résumé from your computer</p>
                    <p className="text-xs text-slate-400 mt-1">Supported formats: PDF documents only · Maximum file size: 10 MB</p>
                  </div>

                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeFileSelect}
                    accept=".pdf,application/pdf"
                    className="hidden"
                  />

                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingResume ? 'Processing & Storing...' : 'Select PDF Document'}</span>
                  </button>
                </div>
              </div>

              {/* Current Active Stored Résumé */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Current Published Résumé in Database</h3>
                {activeResume ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{activeResume.filename}</span>
                        <span className="text-xs text-slate-500 font-mono">
                          Size: {activeResume.fileSize} · Uploaded: {new Date(activeResume.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="/api/resume/download"
                        download
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Real PDF</span>
                      </a>
                      {activeResume.publicUrl && (
                        <a
                          href={activeResume.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 hover:text-slate-900 glass-card rounded-xl border border-slate-200"
                          title="Open direct URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No published résumé found in PostgreSQL documents table.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: OVERALL DSA NUMBERS */}
          {activeTab === 'dsa' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Overall DSA Numerical Progress Form</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage total DSA targets and solved counts directly through validated numeric inputs. Persists to PostgreSQL.
                </p>
              </div>

              {dsaError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{dsaError}</span>
                </div>
              )}

              {dsaSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Overall DSA progress successfully persisted to PostgreSQL!</span>
                </div>
              )}

              {hasDifficultyDiscrepancy && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Notice: Sum of difficulty counts ({difficultySum}) does not equal Total Solved ({dsaSolved}).
                  </span>
                </div>
              )}

              <form onSubmit={handleSaveOverallDsa} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Numeric Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Total DSA Questions Target *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={dsaTarget}
                      onChange={(e) => setDsaTarget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Goal for overall algorithmic problem solving</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Total DSA Questions Solved *</label>
                    <input
                      type="number"
                      min="0"
                      max={dsaTarget}
                      required
                      value={dsaSolved}
                      onChange={(e) => setDsaSolved(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono font-bold text-orange-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Must not exceed target count ({dsaTarget})</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Attempted Count (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={dsaAttempted}
                      onChange={(e) => setDsaAttempted(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Platform / Source</label>
                    <input
                      type="text"
                      value={dsaPlatform}
                      onChange={(e) => setDsaPlatform(e.target.value)}
                      placeholder="LeetCode"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                {/* Difficulty Breakdown (Optional Numeric Inputs) */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Difficulty-Wise Solved Counts (Optional)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Easy</label>
                      <input
                        type="number"
                        min="0"
                        value={dsaEasy}
                        onChange={(e) => setDsaEasy(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Medium</label>
                      <input
                        type="number"
                        min="0"
                        value={dsaMedium}
                        onChange={(e) => setDsaMedium(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-amber-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Hard</label>
                      <input
                        type="number"
                        min="0"
                        value={dsaHard}
                        onChange={(e) => setDsaHard(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-red-700 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Computed Metrics */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Remaining Questions</span>
                    <span className="text-base font-bold text-slate-900 font-mono">{dsaRemaining}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Completion Target</span>
                    <span className="text-base font-bold text-orange-600 font-mono">{dsaPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Database Sync Status</span>
                    <span className="text-emerald-700 font-semibold font-mono">
                      {dsaUpdatedAt ? `Updated ${new Date(dsaUpdatedAt).toLocaleTimeString()}` : 'Ready to Save'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dsaSaving}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{dsaSaving ? 'Persisting to Database...' : 'Save Overall DSA Numbers'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: GATE SUBJECTS MANAGER */}
          {activeTab === 'gate' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">GATE CS & DA Per-Subject Numerical Manager</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage individual question targets, solved PYQs, and revision cycles for each GATE subject. Dropdowns select subjects; numeric fields control counts.
                </p>
              </div>

              {gateError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{gateError}</span>
                </div>
              )}

              {gateSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Subject progress successfully saved and verified in PostgreSQL!</span>
                </div>
              )}

              {/* Track Selection Switcher */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTrackChange('CS')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gateTrack === 'CS' ? 'bg-orange-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  GATE CS Track ({gateSubjectsList.cs.length} Subjects)
                </button>
                <button
                  onClick={() => handleTrackChange('DA')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gateTrack === 'DA' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  GATE DA Track ({gateSubjectsList.da.length} Subjects)
                </button>
              </div>

              {/* Subject Editor Form */}
              <form onSubmit={handleSaveGateSubject} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Subject Dropdown Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Select Subject to Edit</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => {
                      const sub = currentGateList.find(s => s.id === e.target.value);
                      if (sub) populateSubjectForm(sub);
                    }}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-semibold"
                  >
                    {currentGateList.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.solvedPyqs} / {sub.targetPyqs} Solved — {sub.completionPercentage}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direct Numerical Question Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Target PYQ Count *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={subjectTargetPyqs}
                      onChange={(e) => setSubjectTargetPyqs(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Solved PYQs Count *</label>
                    <input
                      type="number"
                      min="0"
                      max={subjectTargetPyqs}
                      required
                      value={subjectSolvedPyqs}
                      onChange={(e) => setSubjectSolvedPyqs(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono font-bold text-orange-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Revision Rounds Completed</label>
                    <input
                      type="number"
                      min="0"
                      value={subjectRevisionRounds}
                      onChange={(e) => setSubjectRevisionRounds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Notes & Study Reference (Optional)</label>
                  <input
                    type="text"
                    value={subjectNotes}
                    onChange={(e) => setSubjectNotes(e.target.value)}
                    placeholder="e.g. Mastered algorithms PYQs 2012-2025"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Computed Preview */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Remaining PYQs</span>
                    <span className="text-base font-bold text-slate-900 font-mono">{subjectRemaining}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Completion %</span>
                    <span className="text-base font-bold text-orange-600 font-mono">{subjectPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Revision Status</span>
                    <span className="text-emerald-700 font-semibold font-mono">Cycle {subjectRevisionRounds} Completed</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={gateSaving}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{gateSaving ? 'Saving to Database...' : 'Save Subject Progress'}</span>
                </button>
              </form>

              {/* Table of All Subjects in Selected Track */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="p-4">Subject Name</th>
                      <th className="p-4">Target PYQs</th>
                      <th className="p-4">Solved PYQs</th>
                      <th className="p-4">Remaining</th>
                      <th className="p-4">Completion %</th>
                      <th className="p-4">Revision Cycle</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentGateList.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                        <td className="p-4 font-mono">{sub.targetPyqs}</td>
                        <td className="p-4 font-mono font-bold text-orange-600">{sub.solvedPyqs}</td>
                        <td className="p-4 font-mono text-slate-500">{sub.remainingPyqs}</td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-semibold">
                            {sub.completionPercentage}%
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{sub.revisionStatus}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => populateSubjectForm(sub)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT SUBMISSIONS */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Verified Contact Form Submissions</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Messages stored in PostgreSQL database with honest provider delivery status telemetry.
                  </p>
                </div>
                <button
                  onClick={loadContacts}
                  disabled={loadingContacts}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingContacts ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {contactSubmissions.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold text-slate-600">No contact submissions found in database.</p>
                  <p className="text-xs text-slate-400 mt-1">Submitted inquiries through the public portfolio will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactSubmissions.map((sub, idx) => (
                    <div key={sub.id || idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                          <span className="text-xs text-slate-500 font-mono ml-2">({sub.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono ${
                            sub.status === 'accepted_by_provider' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            sub.status === 'accepted_by_server' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{new Date(sub.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-1">Subject: {sub.subject}</span>
                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                          {sub.message}
                        </p>
                      </div>

                      {sub.providerNote && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Provider Diagnostic: {sub.providerNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TELEMETRY */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Privacy Telemetry & Click Distribution</h2>
                <p className="text-sm text-slate-500 mt-1">Real visitor engagement events collected with zero third-party tracking cookies.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Project Clicks Breakdown</h3>
                <div className="space-y-3">
                  {Object.keys(analytics.projectClicks || {}).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No project clicks recorded yet.</p>
                  ) : (
                    Object.entries(analytics.projectClicks).map(([proj, count]: [string, any], idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs sm:text-sm bg-slate-50 p-3 rounded-xl">
                        <span className="font-medium text-slate-700 uppercase">{proj}</span>
                        <span className="font-bold text-orange-600 font-mono">{count} clicks</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
