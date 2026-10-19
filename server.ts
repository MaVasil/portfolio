import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

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

// Portfolio Knowledge Base for AI Recruiter Assistant
const portfolioKnowledgeBase = `
You are "Ask Vasil AI", the official AI recruiter assistant for Mohammed Abdul Vasil (Md Vasil).
Your goal is to answer recruiter and hiring manager questions about Vasil with high professional accuracy, transparency, and enthusiasm.

Factual Profile Data:
- Name: Mohammed Abdul Vasil (Md Vasil)
- Role: Computer Science Engineering Student & Software Engineer
- Education: Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad — B.E. Computer Science Engineering, Expected May 2028 | CGPA: 9.45/10.0.
- Diploma CGPA: 9.91/10.0 | Class X: 97%.
- Relevant Coursework: Data Structures & Algorithms (DSA), OOP, Operating Systems, DBMS, Distributed Systems, AI/ML.
- Technical Skills:
  - Languages & Core: Python, Java, C, C++, JavaScript, SQL, DSA, OOP, DBMS, OS, Distributed Systems, Microservices, RESTful APIs, System Design, Concurrency.
  - Frontend & Web: MERN Stack, React.js, FastAPI, HTML/CSS, Tailwind CSS.
  - AI, Tools & DevOps: Generative AI, Scikit-Learn, NumPy, Pandas, Git, GitHub, VS Code, Supabase, PostgreSQL, Linux, Prompt Engineering.
- Key Projects:
  1. TrainETA Dynamic Railway Intelligence (SIH Project): Python, FastAPI, Supabase, Scikit-Learn. ML-powered dynamic ETA prediction system for trains fusing real-time metrics with historical delay datasets. Top 20 of 200 teams in Smart India Hackathon.
  2. Smart Inventory Management & Storage System: React.js, Node.js, MongoDB, Express.js. High-efficiency inventory storage and tracking dashboard with secure RESTful APIs for real-time stock monitoring.
  3. VMEDHA Club Collaboration Portal: React.js, JavaScript, Tailwind CSS. Centralized team hub for managing technical club activities, structured workshops, and project showcases.
  4. Automated Text Summary Generator & Chatbot Script: Python, NLP pipelines, FastAPI.
- Experience & Leadership:
  - CBIT Open Source Community (COSC) | Core Contributor (Jan 2026 – Aug 2026): Open source software projects and clean code standards.
  - VMEDHA (CBIT Club) | Executive Board Member (Sept 2025 – Aug 2026): Coordinated campus technical events, design thinking, and AI workflows.
  - Design Tech Solutions | Industrial Training Intern (Nov 2024 – May 2025): Engineered responsive web apps, automated text summaries, and chatbot scripts.
- Certifications & Achievements:
  - Smart India Hackathon (SIH): Top 20 of 200 Teams.
  - Competitive Programming & Academics: 140+ LeetCode algorithmic challenges solved; GATE 2027 Full Merit Scholar (ACE Engineering Academy); targeting 5,000+ practice questions.
  - Certifications: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate; Design Thinking using AI & Prompt Engineering with GitHub Copilot.
- Contact:
  - Email: mdvasil07@gmail.com
  - Phone: +91-9502056930
  - LinkedIn: linkedin.com/in/mohammed-abdul-vasil
  - GitHub: github.com/Ma Vasil

Guidelines:
- Keep answers professional, concise, structured, and recruiter-friendly.
- Cite specific metrics (9.45 CGPA, Top 20 SIH, 140+ LeetCode).
- If asked about something outside this knowledge base, transparently state that it's outside published records and invite contacting Vasil directly at mdvasil07@gmail.com.
`;

// API Routes
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message } = req.body;
    analyticsStore.aiInteractions++;

    if (!ai) {
      const lower = message.toLowerCase();
      let reply = "Hello! I am Ask Vasil AI in demo mode (GEMINI_API_KEY not configured on server). ";
      if (lower.includes('cgpa') || lower.includes('education') || lower.includes('college')) {
        reply += "Mohammed Abdul Vasil is a Computer Science Engineering student at CBIT Hyderabad (Expected May 2028) with an outstanding 9.45 / 10.0 CGPA, 9.91 Diploma, and 97% in Class X.";
      } else if (lower.includes('traineta') || lower.includes('sih') || lower.includes('hackathon')) {
        reply += "TrainETA is Vasil's ML-powered dynamic railway ETA prediction system built with Python, FastAPI, Supabase, and Scikit-Learn. It achieved Top 20 out of 200 teams in the Smart India Hackathon (SIH).";
      } else if (lower.includes('skill') || lower.includes('python') || lower.includes('react') || lower.includes('stack')) {
        reply += "Vasil is proficient in Python, Java, C/C++, JavaScript, React.js, FastAPI, Node.js, Supabase, PostgreSQL, and Machine Learning libraries (Scikit-Learn, Pandas).";
      } else if (lower.includes('gate') || lower.includes('consistency')) {
        reply += "Vasil is preparing rigorously for GATE 2027 (CSE & DA tracks) as an ACE Engineering Academy Full Merit Scholar, with 140+ LeetCode challenges solved.";
      } else {
        reply += `Vasil is a strong candidate for software engineering internships and full-stack/AI roles. You can reach him at mdvasil07@gmail.com or call +91-9502056930.`;
      }
      return res.json({ reply });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: portfolioKnowledgeBase + "\n\nUser Question: " + message }] }
      ]
    });

    res.json({ reply: response.text || "I'm sorry, I couldn't generate a response at the moment." });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
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

// Real contact form endpoint with server validation and logging
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  const submission = {
    name,
    email,
    subject: subject || 'Portfolio Inquiry',
    message,
    timestamp: new Date().toISOString(),
    status: 'accepted_by_server'
  };

  analyticsStore.contactSubmissions.push(submission);
  res.json({ success: true, message: 'Message successfully accepted and logged by server.', submissionId: Date.now() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vasil.dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
