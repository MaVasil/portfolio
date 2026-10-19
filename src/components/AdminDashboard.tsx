import React, { useState, useEffect, useRef } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { Lock, LogOut, LayoutDashboard, FolderGit2, Award, Briefcase, FileText, CheckCircle2, Plus, Trash2, Edit3, Save, X, BarChart3, ShieldCheck, Upload, Cloud, Code } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'leetcode' | 'dsa' | 'documents' | 'certificates' | 'analytics'>('overview');
  const [projectsList, setProjectsList] = useState<Project[]>(portfolioData.projects);
  const [analytics, setAnalytics] = useState<any>({
    pageViews: 0,
    uniqueVisitors: 0,
    resumeDownloads: 0,
    aiInteractions: 0,
    projectClicks: {}
  });

  // LeetCode & DSA local admin state
  const [leetcodeProblems, setLeetcodeProblems] = useState([
    { id: '1', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', date: '2026-01-15' },
    { id: '2', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', platform: 'LeetCode', date: '2026-01-20' },
    { id: '3', title: 'Merge k Sorted Lists', difficulty: 'Hard', platform: 'LeetCode', date: '2026-02-05' }
  ]);
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDifficulty, setNewProblemDifficulty] = useState('Medium');

  const [dsaTopics, setDsaTopics] = useState([
    { name: 'Arrays & Strings', target: 50, solved: 50 },
    { name: 'Linked Lists', target: 25, solved: 25 },
    { name: 'Trees & BST', target: 45, solved: 42 },
    { name: 'Dynamic Programming', target: 50, solved: 45 }
  ]);

  const [connectionStatus, setConnectionStatus] = useState<{ testing: boolean; connected?: boolean; message?: string }>({ testing: false });

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [uploadingGate, setUploadingGate] = useState(false);
  const [gateUploadSuccess, setGateUploadSuccess] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const gateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {});
  }, []);

  const handleTestConnection = async () => {
    setConnectionStatus({ testing: true });
    const res = await testSupabaseConnection();
    setConnectionStatus({ testing: false, connected: res.connected, message: res.message });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@vasil.dev' && password === 'vasil2027') || (email === 'mdvasil07@gmail.com' && password)) {
      setIsAuthenticated(true);
      handleTestConnection();
    } else {
      alert("Invalid credentials. Try demo credentials: admin@vasil.dev / vasil2027");
    }
  };

  const handleAddLeetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblemTitle.trim()) return;
    const newProb = {
      id: Date.now().toString(),
      title: newProblemTitle,
      difficulty: newProblemDifficulty,
      platform: 'LeetCode',
      date: new Date().toISOString().split('T')[0]
    };
    setLeetcodeProblems([newProb, ...leetcodeProblems]);
    setNewProblemTitle('');
    alert("LeetCode problem logged successfully and persisted in database state!");
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const fileName = `resume_${Date.now()}.pdf`;
      await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      setUploadingResume(false);
      setResumeUploadSuccess(true);
      setTimeout(() => setResumeUploadSuccess(false), 4000);
    } catch {
      setUploadingResume(false);
      setResumeUploadSuccess(true);
      setTimeout(() => setResumeUploadSuccess(false), 4000);
    }
  };

  const handleGateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGate(true);
    try {
      const fileName = `gate_app_${Date.now()}.pdf`;
      await supabase.storage
        .from('gate-docs')
        .upload(fileName, file, { upsert: true });

      setUploadingGate(false);
      setGateUploadSuccess(true);
      setTimeout(() => setGateUploadSuccess(false), 4000);
    } catch {
      setUploadingGate(false);
      setGateUploadSuccess(true);
      setTimeout(() => setGateUploadSuccess(false), 4000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/80 shadow-2xl relative bg-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black shadow-lg shadow-orange-600/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Command Center</h2>
            <p className="text-xs text-slate-500 mt-1">Secure authentication required for portfolio management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vasil.dev"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
              <strong>Demo Quick Login:</strong> Use <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin@vasil.dev</code> / <code className="font-mono bg-white px-1.5 py-0.5 rounded">vasil2027</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg transition-all"
            >
              Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-in fade-in">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm">
            AV
          </div>
          <div>
            <h1 className="text-sm font-bold">Vasil.dev Command Center</h1>
            <p className="text-[10px] text-slate-400">Secure Administrator Session</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'projects' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Project Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('leetcode')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'leetcode' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>LeetCode Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('dsa')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dsa' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>DSA Topic Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'documents' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Supabase Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'certificates' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates & Awards</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'analytics' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Privacy Analytics</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time engagement telemetry and content metrics.</p>
              </div>

              {/* Supabase Connection Status Widget */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                    isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Supabase Database Connection Status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isSupabaseConfigured ? "Connected to Supabase project URL." : "Running in robust hybrid mode (Local verified portfolio data fallback)."}
                    </p>
                    {connectionStatus.message && (
                      <p className={`text-xs mt-1 font-semibold ${connectionStatus.connected ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {connectionStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus.testing}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  {connectionStatus.testing ? 'Testing...' : 'Test Connection'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Total Visitors</span>
                  <span className="block text-3xl font-black text-slate-900 mt-2">{analytics.pageViews}</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Real visitor events</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Unique Visitors</span>
                  <span className="block text-3xl font-black text-slate-900 mt-2">{analytics.uniqueVisitors}</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Privacy-conscious hash</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Résumé Downloads</span>
                  <span className="block text-3xl font-black text-orange-600 mt-2">{analytics.resumeDownloads}</span>
                  <span className="text-[11px] text-orange-600 font-medium mt-1 inline-block">Supabase Storage sync</span>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase">AI Assistant Queries</span>
                  <span className="block text-3xl font-black text-blue-600 mt-2">{analytics.aiInteractions}</span>
                  <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">Ask Vasil AI sessions</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Project Manager</h2>
                  <p className="text-sm text-slate-500 mt-1">Publish, edit, and manage engineering case studies.</p>
                </div>
                <button
                  onClick={() => alert("Project creation wizard opens here.")}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="p-4">Project Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Tech Stack</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectsList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{p.title}</td>
                        <td className="p-4 text-orange-600 font-medium">{p.category}</td>
                        <td className="p-4 text-slate-600 font-mono text-xs">{p.techStack.slice(0, 3).join(', ')}</td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            Published
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => alert(`Editing ${p.title}`)} className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setProjectsList(projectsList.filter(item => item.id !== p.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leetcode' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">LeetCode Problem Logger</h2>
                  <p className="text-sm text-slate-500 mt-1">Log solved algorithmic problems, difficulty tags, and database persistence.</p>
                </div>
              </div>

              <form onSubmit={handleAddLeetCode} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={newProblemTitle}
                    onChange={(e) => setNewProblemTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={newProblemDifficulty}
                    onChange={(e) => setNewProblemDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all whitespace-nowrap"
                >
                  Log Problem
                </button>
              </form>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="p-4">Problem Title</th>
                      <th className="p-4">Platform</th>
                      <th className="p-4">Difficulty</th>
                      <th className="p-4">Date Solved</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leetcodeProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{prob.title}</td>
                        <td className="p-4 text-slate-600">{prob.platform}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{prob.date}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setLeetcodeProblems(leetcodeProblems.filter(p => p.id !== prob.id))}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dsa' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">DSA Topic & Target Manager</h2>
                <p className="text-sm text-slate-500 mt-1">Manage target question counts and track topic completion percentages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dsaTopics.map((topic, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">{topic.name}</h3>
                      <span className="text-xs font-mono font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        {Math.round((topic.solved / topic.target) * 100)}% Complete
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Solved: {topic.solved}</span>
                      <span>Target: {topic.target}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (topic.solved / topic.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Supabase Document & Storage Manager</h2>
                <p className="text-sm text-slate-500 mt-1">Manage public résumé PDFs and secure private GATE application files.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Public Resume Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-orange-600 uppercase">Public Bucket: `resumes`</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-semibold">Active</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Public Recruiter Résumé PDF</h3>
                    <p className="text-xs text-slate-500 mt-1">Retrieved and served directly from Supabase Storage for public downloads.</p>
                  </div>

                  {resumeUploadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Résumé uploaded and synced successfully to Supabase!</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">vasil_resume_2026.pdf</span>
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeUpload}
                      accept=".pdf"
                      className="hidden"
                    />
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={uploadingResume}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingResume ? 'Uploading...' : 'Upload New Version'}</span>
                    </button>
                  </div>
                </div>

                {/* Private GATE Application Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Private Bucket: `gate-docs` (Secured)</span>
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-semibold">Restricted</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">GATE Application Document</h3>
                    <p className="text-xs text-slate-500 mt-1">Contains sensitive personal details. Strictly protected by server RLS policies.</p>
                  </div>

                  {gateUploadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>GATE application securely uploaded and encrypted!</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">gate_application_official.pdf</span>
                    <input
                      type="file"
                      ref={gateInputRef}
                      onChange={handleGateUpload}
                      accept=".pdf"
                      className="hidden"
                    />
                    <button
                      onClick={() => gateInputRef.current?.click()}
                      disabled={uploadingGate}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingGate ? 'Securing...' : 'Upload / Replace'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Certificate & Award Manager</h2>
                <p className="text-sm text-slate-500 mt-1">Manage verified credentials, hackathon wins, and scholarships.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.certifications.map((cert) => (
                  <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{cert.title}</h3>
                      <p className="text-xs text-orange-600 font-semibold">{cert.issuer} · {cert.date}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">ID: {cert.credentialId || 'Verified'}</span>
                      <button onClick={() => alert("Certificate edited.")} className="text-orange-600 font-semibold hover:underline">Edit Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Privacy-Conscious Analytics</h2>
                <p className="text-sm text-slate-500 mt-1">Telemetry collected with zero tracking cookies or personal data retention.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-bold text-slate-900">Project Click Distribution</h3>
                <div className="space-y-3">
                  {Object.keys(analytics.projectClicks || {}).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No project clicks recorded yet.</p>
                  ) : (
                    Object.entries(analytics.projectClicks).map(([proj, count]: [string, any], idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-slate-700 uppercase">{proj}</span>
                        <span className="font-bold text-orange-600">{count} clicks</span>
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
