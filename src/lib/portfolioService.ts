import { supabase } from './supabase';
import { portfolioData, Project, ExperienceItem, CertificationItem } from '../data/portfolioData';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true);

    if (error || !data || data.length === 0) {
      return portfolioData.projects;
    }

    return data.map((item: any) => ({
      id: item.slug || item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      description: item.description,
      longDescription: item.long_description,
      metrics: item.metrics,
      techStack: item.tech_stack || [],
      architecture: item.architecture || [],
      githubUrl: item.github_url,
      liveUrl: item.live_url,
      featured: item.featured,
      badge: item.badge
    }));
  } catch {
    return portfolioData.projects;
  }
}

export async function fetchExperience(): Promise<ExperienceItem[]> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('published', true);

    if (error || !data || data.length === 0) {
      return portfolioData.experiences;
    }

    return data.map((item: any) => ({
      id: item.id,
      role: item.role,
      organization: item.organization,
      period: item.period,
      location: item.location,
      description: item.description,
      highlights: item.highlights || [],
      skills: item.skills || []
    }));
  } catch {
    return portfolioData.experiences;
  }
}

export async function fetchCertifications(): Promise<CertificationItem[]> {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('published', true);

    if (error || !data || data.length === 0) {
      return portfolioData.certifications;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      credentialId: item.credential_id,
      verificationUrl: item.verification_url
    }));
  } catch {
    return portfolioData.certifications;
  }
}

export async function fetchDsaTopics() {
  try {
    const { data, error } = await supabase
      .from('dsa_topics')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { topic_name: 'Arrays & Strings', target_count: 50, solved_count: 50, topic_status: 'Mastered' },
        { topic_name: 'Linked Lists', target_count: 25, solved_count: 25, topic_status: 'Mastered' },
        { topic_name: 'Stacks & Queues', target_count: 30, solved_count: 30, topic_status: 'Mastered' },
        { topic_name: 'Trees & BST', target_count: 45, solved_count: 42, topic_status: 'Advanced' },
        { topic_name: 'Graphs & Traversals', target_count: 40, solved_count: 38, topic_status: 'Advanced' },
        { topic_name: 'Dynamic Programming', target_count: 50, solved_count: 45, topic_status: 'Advanced' },
        { topic_name: 'Heaps & Hashing', target_count: 30, solved_count: 30, topic_status: 'Mastered' }
      ];
    }
    return data;
  } catch {
    return [
      { topic_name: 'Arrays & Strings', target_count: 50, solved_count: 50, topic_status: 'Mastered' },
      { topic_name: 'Linked Lists', target_count: 25, solved_count: 25, topic_status: 'Mastered' }
    ];
  }
}

export async function trackAnalyticsEvent(event: string, meta?: any) {
  try {
    await supabase.from('analytics_events').insert([{ event_type: event, meta }]);
  } catch {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, meta })
      });
    } catch {}
  }
}

export interface OverallDsaData {
  target: number;
  solved: number;
  attempted: number;
  easy: number;
  medium: number;
  hard: number;
  platform: string;
  remaining: number;
  percentage: number;
  updatedAt: string;
}

export async function fetchOverallDsa(): Promise<OverallDsaData> {
  try {
    const res = await fetch('/api/dsa/overall');
    if (!res.ok) throw new Error('Failed to fetch overall DSA');
    return await res.json();
  } catch {
    return {
      target: 500,
      solved: 187,
      attempted: 210,
      easy: 70,
      medium: 95,
      hard: 22,
      platform: 'LeetCode',
      remaining: 313,
      percentage: 37,
      updatedAt: new Date().toISOString()
    };
  }
}

export interface GateSubjectItem {
  id: string;
  examType: 'CS' | 'DA';
  name: string;
  targetPyqs: number;
  solvedPyqs: number;
  attemptedPyqs: number;
  remainingPyqs: number;
  completionPercentage: number;
  revisionStatus: string;
  revisionRounds: number;
  notes: string;
  displayOrder: number;
  pyqsDisplay: string;
  updatedAt: string;
}

export async function fetchGateSubjects(): Promise<{ cs: GateSubjectItem[]; da: GateSubjectItem[] }> {
  try {
    const res = await fetch('/api/gate/subjects');
    if (!res.ok) throw new Error('Failed to fetch GATE subjects');
    const data = await res.json();
    return { cs: data.cs || [], da: data.da || [] };
  } catch {
    return { cs: [], da: [] };
  }
}

export interface LatestResumeInfo {
  id: string;
  filename: string;
  fileSize: string;
  storagePath: string;
  publicUrl: string;
  uploadedAt: string;
}

export async function fetchLatestResume(): Promise<LatestResumeInfo | null> {
  try {
    const res = await fetch('/api/resume/latest');
    if (!res.ok) return null;
    const data = await res.json();
    return data.document || null;
  } catch {
    return null;
  }
}

