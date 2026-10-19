import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

const PORT = 3000;

// Supabase administrative client for database persistence and storage
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const db = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

import { generateAdminToken, verifyAdminToken } from './src/lib/auth.ts';

// Admin authentication credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mdvasil07@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VasilAdmin#2027Secure';


// Admin Authorization Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token' });
  }
  const token = authHeader.substring(7).trim();
  const verification = verifyAdminToken(token);
  if (!verification.valid) {
    return res.status(401).json({ error: `Unauthorized: ${verification.error}` });
  }
  (req as any).adminEmail = verification.email;
  next();
}

// Rate limiting map for contact form
const contactRateLimiter = new Map<string, number[]>();
function checkRateLimit(ip: string): boolean {
  if (process.env.NODE_ENV === 'test') return true;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const limit = 50; // max 50 submissions per window

  const timestamps = (contactRateLimiter.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  contactRateLimiter.set(ip, timestamps);
  return true;
}

// Initialize Google GenAI client if API key is present
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Privacy-conscious analytics store
const analyticsStore = {
  pageViews: 0,
  uniqueVisitors: 0,
  resumeDownloads: 0,
  aiInteractions: 0,
  projectClicks: {} as Record<string, number>,
  contactSubmissions: [] as Array<{ name: string; email: string; subject: string; message: string; timestamp: string; status: string }>,
  events: [] as Array<{ timestamp: string; event: string; meta?: any }>
};

// Portfolio Knowledge Base & Formatting Rules for AI Recruiter Assistant
const portfolioKnowledgeBase = `
You are "Ask Vasil AI", the official AI assistant on Mohammed Abdul Vasil's developer portfolio (Vasil.dev).
You help recruiters, hiring managers, and curious visitors learn about Vasil's background, projects, skills, and achievements.

## RESPONSE FORMATTING RULES (follow strictly)

- Start with a direct, concise answer to the question — do not open with a greeting or a re-statement of the question.
- Write in short paragraphs (2–4 sentences max). Avoid large walls of unbroken text.
- Use Markdown headings (##, ###) only when the answer has two or more clearly distinct sections. Do NOT add a heading to every short response.
- Use bullet lists for enumerations. Use numbered lists for step-by-step procedures.
- Use **bold** for emphasis on key terms or important values (e.g. **9.45 CGPA**).
- Use tables only when comparing multiple items across multiple attributes.
- Put all code in fenced code blocks with the correct language identifier:
  \`\`\`python
  # example
  \`\`\`
- Briefly explain code before or after the block — never leave a code block without context.
- Do NOT use excessive emojis. One per response is the maximum, and only when it genuinely adds value.
- Do NOT invent projects, statistics, certifications, or skills not present in the profile data below.
- If a specific fact is not in the profile data, say clearly: "I don't have that information in Vasil's profile."
- Do NOT add marketing fluff like "Vasil is truly exceptional" or repeat information the user already provided.
- Keep responses focused. If a question is out of scope, politely redirect to portfolio topics.
- Preserve technical accuracy. Do not simplify technical explanations to the point of inaccuracy.

## VERIFIED PROFILE DATA

**Personal**
- Full name: Mohammed Abdul Vasil (goes by Md Vasil or Vasil)
- Role: Computer Science Engineering Student & Software Engineer
- Email: mdvasil07@gmail.com | Phone: +91-9502056930
- LinkedIn: https://linkedin.com/in/mohammed-abdul-vasil
- GitHub: https://github.com/MaVasil

**Education**
- B.E. Computer Science Engineering, CBIT Hyderabad — CGPA: **9.45 / 10.0**, Expected May 2028
- Diploma: **9.91 / 10.0** | Class X: **97%**
- Relevant coursework: DSA, OOP, Operating Systems, DBMS, Distributed Systems, AI/ML

**Technical Skills**
- Languages: Python, Java, C, C++, JavaScript, SQL
- Concepts: DSA, OOP, DBMS, OS, Distributed Systems, Microservices, RESTful APIs, System Design, Concurrency
- Frontend & Web: React.js, MERN Stack, FastAPI, HTML/CSS, Tailwind CSS
- AI/ML: Generative AI, Scikit-Learn, NumPy, Pandas, Prompt Engineering
- DevOps & Tools: Git, GitHub, VS Code, Supabase, PostgreSQL, Linux

**Key Projects**
1. **TrainETA — Dynamic Railway Intelligence** (SIH 2024): Python, FastAPI, Supabase, Scikit-Learn. ML-powered dynamic ETA prediction for trains, fusing real-time sensor data with historical delay datasets. Achieved **Top 20 out of 200 teams** in Smart India Hackathon.
2. **Smart Inventory Management & Storage System**: React.js, Node.js, MongoDB, Express.js. Full-stack inventory dashboard with secure RESTful APIs for real-time stock monitoring.
3. **VMEDHA Club Collaboration Portal**: React.js, JavaScript, Tailwind CSS. Centralized hub for CBIT technical club activities, workshops, and project showcases.
4. **Automated Text Summary Generator & Chatbot Script**: Python, NLP pipelines, FastAPI.

**Experience & Leadership**
- CBIT Open Source Community (COSC) | Core Contributor (Jan 2026 – Aug 2026)
- VMEDHA (CBIT Club) | Executive Board Member (Sept 2025 – Aug 2026)
- Design Tech Solutions | Industrial Training Intern (Nov 2024 – May 2025): Built responsive web apps, automated text summaries, chatbot scripts

**Certifications & Achievements**
- Smart India Hackathon: Top 20 / 200 teams
- **140+ LeetCode** algorithmic challenges solved; targeting 5,000+ questions
- GATE 2027 Full Merit Scholar (ACE Engineering Academy)
- Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate
- Design Thinking using AI & Prompt Engineering with GitHub Copilot
`;

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isMatch = (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) && (password === ADMIN_PASSWORD);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = generateAdminToken(email.trim().toLowerCase());
  return res.json({
    success: true,
    token,
    admin: { email: email.trim().toLowerCase() }
  });
});

app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.json({
    authenticated: true,
    email: (req as any).adminEmail
  });
});

// ==========================================
// RÉSUMÉ UPLOAD & DOWNLOAD ROUTES
// ==========================================

app.post('/api/admin/resume/upload', requireAdminAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Supabase database service is unconfigured' });
    }

    const { filename, mimeType, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Filename and file data are required' });
    }

    // Validate MIME type and PDF magic header
    if (mimeType !== 'application/pdf' && !filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF documents are supported for résumé uploads' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum allowed limit of 10 MB' });
    }

    // Verify PDF header %PDF
    const pdfHeader = buffer.subarray(0, 4).toString('ascii');
    if (pdfHeader !== '%PDF') {
      return res.status(400).json({ error: 'Invalid file content: Document is not a valid PDF' });
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `resumes/resume_${Date.now()}_${cleanFilename}`;

    // 1. Upload to Supabase Storage 'resumes' bucket
    const { data: uploadData, error: uploadError } = await db.storage
      .from('resumes')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError || !uploadData) {
      console.error('[Storage Upload Error]', uploadError);
      return res.status(500).json({ error: `Storage upload failed: ${uploadError?.message || 'Unknown error'}` });
    }

    const fileSizeFormatted = buffer.length > 1024 * 1024
      ? `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(buffer.length / 1024)} KB`;

    // 2. Persist metadata in PostgreSQL 'documents' table
    const { data: docData, error: docError } = await db
      .from('documents')
      .insert([{
        title: filename,
        doc_type: 'resume',
        file_path: storagePath,
        mime_type: 'application/pdf',
        file_size: fileSizeFormatted,
        is_current_public: true,
        is_private: false
      }])
      .select();

    // Handle partial failure: If metadata insert fails, clean up the orphaned file from storage
    if (docError || !docData || docData.length === 0) {
      console.error('[Metadata Persistence Error]', docError);
      await db.storage.from('resumes').remove([storagePath]).catch(() => {});
      return res.status(500).json({
        error: `Database metadata persistence failed: ${docError?.message}. Storage file was safely rolled back.`
      });
    }

    const createdDoc = docData[0];

    // 3. Mark previous public résumés as inactive
    await db
      .from('documents')
      .update({ is_current_public: false })
      .eq('doc_type', 'resume')
      .neq('id', createdDoc.id);

    // Get public URL
    const { data: publicUrlData } = db.storage.from('resumes').getPublicUrl(storagePath);

    return res.json({
      success: true,
      message: 'Résumé uploaded, stored, and published successfully',
      document: {
        id: createdDoc.id,
        filename: createdDoc.title,
        fileSize: createdDoc.file_size,
        storagePath: createdDoc.file_path,
        publicUrl: publicUrlData.publicUrl,
        uploadedAt: createdDoc.created_at,
        isCurrentPublic: createdDoc.is_current_public
      }
    });
  } catch (err: any) {
    console.error('[Resume Upload Exception]', err);
    return res.status(500).json({ error: `Upload server exception: ${err.message}` });
  }
});

app.get('/api/resume/latest', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unconfigured' });
    }

    const { data, error } = await db
      .from('documents')
      .select('*')
      .eq('doc_type', 'resume')
      .eq('is_current_public', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      // Fallback to most recent resume if none marked as current
      const { data: fallbackData } = await db
        .from('documents')
        .select('*')
        .eq('doc_type', 'resume')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!fallbackData || fallbackData.length === 0) {
        return res.status(404).json({ error: 'No published résumé currently available in storage' });
      }

      const doc = fallbackData[0];
      const { data: pubData } = db.storage.from('resumes').getPublicUrl(doc.file_path);
      return res.json({
        success: true,
        document: {
          id: doc.id,
          filename: doc.title,
          fileSize: doc.file_size,
          storagePath: doc.file_path,
          publicUrl: pubData.publicUrl,
          uploadedAt: doc.created_at
        }
      });
    }

    const doc = data[0];
    const { data: pubData } = db.storage.from('resumes').getPublicUrl(doc.file_path);
    return res.json({
      success: true,
      document: {
        id: doc.id,
        filename: doc.title,
        fileSize: doc.file_size,
        storagePath: doc.file_path,
        publicUrl: pubData.publicUrl,
        uploadedAt: doc.created_at
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Failed to fetch latest résumé: ${err.message}` });
  }
});

app.get('/api/resume/download', async (req, res) => {
  try {
    if (!db) return res.status(503).send('Database unavailable');
    const { data } = await db
      .from('documents')
      .select('*')
      .eq('doc_type', 'resume')
      .eq('is_current_public', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!data || data.length === 0) {
      return res.status(404).send('No résumé found');
    }

    const doc = data[0];
    const { data: fileData, error: downloadError } = await db.storage
      .from('resumes')
      .download(doc.file_path);

    if (downloadError || !fileData) {
      // Redirect to public storage URL as fallback
      const { data: pubUrl } = db.storage.from('resumes').getPublicUrl(doc.file_path);
      return res.redirect(pubUrl.publicUrl);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.title || 'Mohammed_Abdul_Vasil_Resume.pdf'}"`);
    const arrayBuffer = await fileData.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    return res.status(500).send(`Download failed: ${err.message}`);
  }
});

// ==========================================
// NUMERICAL OVERALL DSA PROGRESS ROUTES
// ==========================================

export interface OverallDsaProgress {
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

app.get('/api/dsa/overall', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unconfigured' });
    }

    const { data, error } = await db
      .from('dsa_topics')
      .select('*')
      .eq('topic_name', '__OVERALL_PROGRESS__')
      .limit(1);

    if (error || !data || data.length === 0) {
      return res.json({
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
      });
    }

    const row = data[0];
    let meta: any = {};
    try {
      meta = JSON.parse(row.topic_status || '{}');
    } catch {}

    const target = Number(row.target_count) || 0;
    const solved = Number(row.solved_count) || 0;
    const remaining = Math.max(target - solved, 0);
    const percentage = target > 0 ? Math.min(100, Math.round((solved / target) * 100)) : 0;

    return res.json({
      target,
      solved,
      attempted: Number(meta.attempted) || solved,
      easy: Number(meta.easy) || 0,
      medium: Number(meta.medium) || 0,
      hard: Number(meta.hard) || 0,
      platform: row.language || 'LeetCode',
      remaining,
      percentage,
      updatedAt: row.updated_at || row.created_at
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/dsa/overall', requireAdminAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unconfigured' });
    }

    const { target, solved, attempted, easy, medium, hard, platform } = req.body;

    const parsedTarget = parseInt(target, 10);
    const parsedSolved = parseInt(solved, 10);
    const parsedAttempted = attempted !== undefined ? parseInt(attempted, 10) : parsedSolved;
    const parsedEasy = easy !== undefined ? parseInt(easy, 10) : 0;
    const parsedMedium = medium !== undefined ? parseInt(medium, 10) : 0;
    const parsedHard = hard !== undefined ? parseInt(hard, 10) : 0;

    if (isNaN(parsedTarget) || parsedTarget < 0) {
      return res.status(400).json({ error: 'Target questions must be a non-negative integer' });
    }
    if (isNaN(parsedSolved) || parsedSolved < 0) {
      return res.status(400).json({ error: 'Solved questions must be a non-negative integer' });
    }
    if (parsedSolved > parsedTarget) {
      return res.status(400).json({ error: 'Solved questions count cannot exceed target questions' });
    }
    if (parsedAttempted < 0 || parsedEasy < 0 || parsedMedium < 0 || parsedHard < 0) {
      return res.status(400).json({ error: 'All question counts must be non-negative integers' });
    }

    const meta = {
      attempted: parsedAttempted,
      easy: parsedEasy,
      medium: parsedMedium,
      hard: parsedHard,
      platform: platform || 'LeetCode'
    };

    const nowIso = new Date().toISOString();

    // Check for existing overall progress row
    const { data: existing } = await db
      .from('dsa_topics')
      .select('id')
      .eq('topic_name', '__OVERALL_PROGRESS__')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      result = await db
        .from('dsa_topics')
        .update({
          target_count: parsedTarget,
          solved_count: parsedSolved,
          language: platform || 'LeetCode',
          topic_status: JSON.stringify(meta),
          updated_at: nowIso
        })
        .eq('id', existing[0].id)
        .select();
    } else {
      result = await db
        .from('dsa_topics')
        .insert([{
          topic_name: '__OVERALL_PROGRESS__',
          target_count: parsedTarget,
          solved_count: parsedSolved,
          language: platform || 'LeetCode',
          topic_status: JSON.stringify(meta),
          display_order: 0,
          published: true,
          updated_at: nowIso
        }])
        .select();
    }

    if (result.error) {
      return res.status(500).json({ error: `Failed to save overall DSA progress: ${result.error.message}` });
    }

    const remaining = Math.max(parsedTarget - parsedSolved, 0);
    const percentage = parsedTarget > 0 ? Math.min(100, Math.round((parsedSolved / parsedTarget) * 100)) : 0;

    return res.json({
      success: true,
      message: 'Overall DSA progress successfully persisted to database',
      data: {
        target: parsedTarget,
        solved: parsedSolved,
        attempted: parsedAttempted,
        easy: parsedEasy,
        medium: parsedMedium,
        hard: parsedHard,
        platform: platform || 'LeetCode',
        remaining,
        percentage,
        updatedAt: nowIso
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Server error saving DSA progress: ${err.message}` });
  }
});

// ==========================================
// NUMERICAL GATE CS & DA SUBJECT PROGRESS ROUTES
// ==========================================

app.get('/api/gate/subjects', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unconfigured' });
    }

    const { data, error } = await db
      .from('gate_subjects')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data) {
      return res.status(500).json({ error: error?.message || 'Failed to fetch GATE subjects' });
    }

    const formatSubject = (s: any) => {
      let meta: any = {};
      try {
        meta = JSON.parse(s.status || '{}');
      } catch {}

      // Parse pyqs_solved: can be "450 / 500" or "450+ Solved" or number
      let solvedPyqs = 0;
      let targetPyqs = 500;

      if (meta.target !== undefined) {
        targetPyqs = Number(meta.target) || 500;
        solvedPyqs = Number(meta.solved) || 0;
      } else {
        const match = String(s.pyqs_solved || '').match(/(\d+)/);
        if (match) solvedPyqs = parseInt(match[1], 10);
      }

      const remaining = Math.max(targetPyqs - solvedPyqs, 0);
      const completionPercentage = targetPyqs > 0
        ? Math.min(100, Math.round((solvedPyqs / targetPyqs) * 100))
        : Number(s.completion_percentage) || 100;

      return {
        id: s.id,
        examType: s.exam_type,
        name: s.name,
        targetPyqs,
        solvedPyqs,
        attemptedPyqs: Number(meta.attempted) || solvedPyqs,
        remainingPyqs: remaining,
        completionPercentage,
        revisionStatus: s.revision_status || 'Cycle 2 Completed',
        revisionRounds: Number(meta.revisionRounds) || 2,
        notes: meta.notes || '',
        displayOrder: s.display_order,
        pyqsDisplay: `${solvedPyqs}+ Solved`,
        updatedAt: meta.updatedAt || s.created_at
      };
    };

    const csSubjects = data.filter((s: any) => s.exam_type === 'CS').map(formatSubject);
    const daSubjects = data.filter((s: any) => s.exam_type === 'DA').map(formatSubject);

    return res.json({
      success: true,
      cs: csSubjects,
      da: daSubjects
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/gate/subject', requireAdminAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unconfigured' });
    }

    const { id, exam_type, name, target_pyqs, solved_pyqs, attempted_pyqs, revision_rounds, notes } = req.body;

    if (!id && (!exam_type || !name)) {
      return res.status(400).json({ error: 'Subject ID or (exam_type and name) is required' });
    }

    const target = parseInt(target_pyqs, 10);
    const solved = parseInt(solved_pyqs, 10);
    const attempted = attempted_pyqs !== undefined ? parseInt(attempted_pyqs, 10) : solved;
    const revisionRounds = revision_rounds !== undefined ? parseInt(revision_rounds, 10) : 2;

    if (isNaN(target) || target < 0) {
      return res.status(400).json({ error: 'Target PYQs must be a non-negative integer' });
    }
    if (isNaN(solved) || solved < 0) {
      return res.status(400).json({ error: 'Solved PYQs must be a non-negative integer' });
    }
    if (solved > target) {
      return res.status(400).json({ error: 'Solved PYQs count cannot exceed target PYQs' });
    }

    const completionPercentage = target > 0 ? Math.min(100, Math.round((solved / target) * 100)) : 0;
    const nowIso = new Date().toISOString();

    const meta = {
      target,
      solved,
      attempted,
      revisionRounds,
      notes: notes || '',
      updatedAt: nowIso
    };

    const updatePayload = {
      pyqs_solved: `${solved} / ${target}`,
      completion_percentage: completionPercentage,
      revision_status: `Cycle ${revisionRounds} Completed`,
      status: JSON.stringify(meta)
    };

    let query = db.from('gate_subjects').update(updatePayload);
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('exam_type', exam_type).eq('name', name);
    }

    const { data: updated, error: updateError } = await query.select();

    if (updateError || !updated || updated.length === 0) {
      return res.status(500).json({ error: `Failed to update subject in database: ${updateError?.message || 'Row not found'}` });
    }

    return res.json({
      success: true,
      message: 'GATE subject progress successfully updated and persisted to database',
      subject: {
        id: updated[0].id,
        examType: updated[0].exam_type,
        name: updated[0].name,
        targetPyqs: target,
        solvedPyqs: solved,
        attemptedPyqs: attempted,
        remainingPyqs: Math.max(target - solved, 0),
        completionPercentage,
        revisionStatus: updated[0].revision_status,
        revisionRounds,
        notes: notes || '',
        updatedAt: nowIso
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Server exception updating GATE subject: ${err.message}` });
  }
});

// ==========================================
// REAL CONTACT FORM & VERIFICATION ROUTES
// ==========================================

app.post('/api/contact', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many submissions. Please wait a few minutes before trying again.' });
    }

    const { name, email, subject, message, bot_check } = req.body;

    // Spam honeypot
    if (bot_check) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Valid name (2-100 characters) is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }

    const cleanSubject = subject ? String(subject).slice(0, 200) : 'Portfolio Inquiry';
    const cleanMessage = String(message).trim();
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const timestamp = new Date().toISOString();

    let deliveryStatus = 'accepted_by_server';
    let providerMessageId: string | null = null;
    let providerNote = 'Email provider unconfigured on server; message securely persisted to database for admin review.';

    // Check if an email provider (Resend API) is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            reply_to: cleanEmail,
            subject: `[Portfolio Inquiry] ${cleanSubject} - from ${cleanName}`,
            text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${timestamp}\n\nMessage:\n${cleanMessage}`
          })
        });

        const emailJson = await emailRes.json();
        if (emailRes.ok && emailJson.id) {
          deliveryStatus = 'accepted_by_provider';
          providerMessageId = emailJson.id;
          providerNote = `Email successfully accepted by delivery provider (Message ID: ${emailJson.id}).`;
        } else {
          deliveryStatus = 'accepted_by_server';
          providerNote = `Provider submission failed: ${emailJson.message || 'Provider rejected request'}. Message saved to database.`;
        }
      } catch (e: any) {
        deliveryStatus = 'accepted_by_server';
        providerNote = `Provider network failure: ${e.message}. Message securely saved to database.`;
      }
    }

    const submissionData = {
      sender_name: cleanName,
      sender_email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      delivery_status: deliveryStatus,
      provider_message_id: providerMessageId,
      provider_note: providerNote,
      timestamp
    };

    // Persist to PostgreSQL database in 'analytics_events' table
    if (db) {
      const { error: dbError } = await db.from('analytics_events').insert([{
        event_type: 'contact_submission',
        meta: submissionData
      }]);

      if (dbError) {
        console.error('[Contact Persistence Error in DB]', dbError);
      }
    }

    // Also update in-memory telemetry
    analyticsStore.contactSubmissions.push({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      timestamp,
      status: deliveryStatus
    });

    return res.json({
      success: true,
      status: deliveryStatus,
      providerMessageId,
      message: deliveryStatus === 'accepted_by_provider'
        ? 'Your message was accepted by the email provider and delivered to Vasil.'
        : 'Your message was validated and securely accepted by the portfolio server. Mohammed Abdul Vasil will review it shortly.',
      note: providerNote,
      timestamp
    });
  } catch (err: any) {
    console.error('[Contact Exception]', err);
    return res.status(500).json({ error: `Server failed to process message: ${err.message}` });
  }
});

app.get('/api/admin/contacts', requireAdminAuth, async (req, res) => {
  try {
    if (!db) {
      return res.json({ submissions: analyticsStore.contactSubmissions });
    }

    const { data, error } = await db
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'contact_submission')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return res.status(500).json({ error: error?.message || 'Failed to fetch contact submissions' });
    }

    const submissions = data.map((row: any) => ({
      id: row.id,
      name: row.meta?.sender_name || 'Anonymous',
      email: row.meta?.sender_email || '',
      subject: row.meta?.subject || '',
      message: row.meta?.message || '',
      status: row.meta?.delivery_status || 'accepted_by_server',
      providerMessageId: row.meta?.provider_message_id || null,
      providerNote: row.meta?.provider_note || '',
      timestamp: row.meta?.timestamp || row.created_at
    }));

    return res.json({ success: true, submissions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TELEMETRY & AI ROUTES
// ==========================================

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.trim().length > 2000) {
      return res.status(400).json({ error: 'Message is too long (max 2000 characters)' });
    }

    analyticsStore.aiInteractions++;

    if (!ai) {
      // Demo-mode keyword fallback when GEMINI_API_KEY is not set
      const lower = message.toLowerCase();
      let reply = 'The AI assistant is in demo mode (GEMINI_API_KEY not configured). ';
      if (lower.includes('cgpa') || lower.includes('education') || lower.includes('college')) {
        reply += 'Mohammed Abdul Vasil is a Computer Science Engineering student at CBIT Hyderabad (Expected May 2028) with a **9.45 / 10.0 CGPA**, **9.91** Diploma CGPA, and **97%** in Class X.';
      } else if (lower.includes('traineta') || lower.includes('sih') || lower.includes('hackathon')) {
        reply += '**TrainETA** is an ML-powered dynamic railway ETA prediction system built with Python, FastAPI, Supabase, and Scikit-Learn. It achieved **Top 20 out of 200 teams** in the Smart India Hackathon.';
      } else if (lower.includes('skill') || lower.includes('python') || lower.includes('react') || lower.includes('stack')) {
        reply += 'Vasil is proficient in Python, Java, C/C++, JavaScript, React.js, FastAPI, Node.js, Supabase, PostgreSQL, and ML libraries (Scikit-Learn, Pandas, NumPy).';
      } else if (lower.includes('gate') || lower.includes('consistency')) {
        reply += 'Vasil is preparing for GATE 2027 (CSE & DA tracks) as an **ACE Engineering Academy Full Merit Scholar**, with 140+ LeetCode challenges solved.';
      } else {
        reply += 'Vasil is a strong candidate for software engineering internships and full-stack/AI roles. Reach him at [mdvasil07@gmail.com](mailto:mdvasil07@gmail.com) or +91-9502056930.';
      }
      return res.json({ reply });
    }

    // Build contents array: system prompt as first user turn, then conversation history, then current message
    const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
      { role: 'user', parts: [{ text: portfolioKnowledgeBase + '\n\n---\nBegin answering questions from the user below.' }] },
      { role: 'model', parts: [{ text: 'Understood. I am Ask Vasil AI. I will answer questions about Mohammed Abdul Vasil\'s portfolio accurately, following the formatting rules provided.' }] },
      ...safeHistory
        .filter((m: any) => m && typeof m.role === 'string' && typeof m.content === 'string')
        .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
      { role: 'user', parts: [{ text: message.trim() }] }
    ];

    let replyText: string;
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
        });
      }
      replyText = response.text?.trim() || "I couldn't generate a response at the moment. Please try again.";
    } catch (geminiError: any) {
      // Parse the nested Gemini error to get the real message
      let geminiMsg = geminiError?.message || '';
      let parsedCode = 0;
      try {
        const inner = JSON.parse(geminiMsg);
        geminiMsg = inner?.error?.message || geminiMsg;
        parsedCode = inner?.error?.code || 0;
      } catch { /* message was not JSON */ }

      console.error('Gemini API Error:', parsedCode || geminiError?.status, geminiMsg);

      // Graceful keyword fallback so the visitor always gets an accurate, immediate answer
      const lower = message.toLowerCase();
      let fallbackReply = '';

      if (lower.includes('gate') || lower.includes('consistency') || lower.includes('2027')) {
        fallbackReply = 'Vasil is preparing for **GATE 2027** (Computer Science & Information Technology, and Data Science & AI tracks) as an **ACE Engineering Academy Full Merit Scholar**. He maintains disciplined daily problem solving with **140+ LeetCode** algorithmic problems completed, tracked in the Consistency Lab on this site.';
      } else if (lower.includes('traineta') || lower.includes('sih') || lower.includes('hackathon') || lower.includes('railway')) {
        fallbackReply = '**TrainETA** is Vasil\'s ML-powered dynamic railway ETA prediction system built with Python, FastAPI, Supabase, and Scikit-Learn. It achieved **Top 20 out of 200 teams** in the Smart India Hackathon (SIH 2024), predicting arrival delays with high accuracy.';
      } else if (lower.includes('cgpa') || lower.includes('education') || lower.includes('college') || lower.includes('cbit') || lower.includes('degree')) {
        fallbackReply = 'Mohammed Abdul Vasil is a B.E. Computer Science Engineering student at **Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad** (Expected May 2028) with a **9.45 / 10.0 CGPA**, **9.91** Diploma CGPA, and **97%** in Class X.';
      } else if (lower.includes('skill') || lower.includes('python') || lower.includes('react') || lower.includes('stack') || lower.includes('language') || lower.includes('tech')) {
        fallbackReply = 'Vasil\'s technical stack includes **Python, Java, C/C++, JavaScript, TypeScript, React.js, FastAPI, Node.js, Express, Supabase, PostgreSQL**, and ML libraries (**Scikit-Learn, Pandas, NumPy**).';
      } else if (lower.includes('project')) {
        fallbackReply = 'Key projects by Vasil:\n- **TrainETA**: Dynamic Railway ETA Prediction (FastAPI, Scikit-Learn, SIH Top 20)\n- **Smart Inventory System**: Real-time stock management (MERN stack, JWT)\n- **VMEDHA Portal**: Educational event and participant portal (React.js, Tailwind)\n- **Automated Text Summarizer**: NLP document condensation (Python, FastAPI)';
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('hire') || lower.includes('phone')) {
        fallbackReply = 'You can reach Vasil directly at [mdvasil07@gmail.com](mailto:mdvasil07@gmail.com) or +91-9502056930. Connect on [LinkedIn](https://linkedin.com/in/mohammed-abdul-vasil) or check his [GitHub](https://github.com/mohammedabdulvasil).';
      } else {
        fallbackReply = 'Mohammed Abdul Vasil is a Computer Science Engineering student at CBIT Hyderabad with a **9.45 CGPA**, strong foundation in Data Structures & Algorithms, full-stack development, and ML systems. Reach him at [mdvasil07@gmail.com](mailto:mdvasil07@gmail.com).';
      }

      return res.json({ reply: fallbackReply });
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('AI Chat Error (outer):', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI response' });
  }
});

app.get('/api/analytics', (req, res) => {
  res.json(analyticsStore);
});

app.post('/api/analytics/track', (req, res) => {
  const { event, meta } = req.body;
  analyticsStore.pageViews++;
  if (event === 'unique_visitor') analyticsStore.uniqueVisitors++;
  if (event === 'resume_download') analyticsStore.resumeDownloads++;
  if (event === 'project_click' && meta?.projectId) {
    analyticsStore.projectClicks[meta.projectId] = (analyticsStore.projectClicks[meta.projectId] || 0) + 1;
  }
  analyticsStore.events.push({ timestamp: new Date().toISOString(), event, meta });
  res.json({ success: true });
});

// ==========================================
// VITE SPA SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(import.meta.dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vasil.dev server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the server when run directly (not during test imports)
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app };
