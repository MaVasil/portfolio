require('dotenv').config();
const k = (process.env.GEMINI_API_KEY || '').trim();
console.log({
  len: k.length,
  prefix: k.slice(0, 8),
  suffix: k.slice(-4),
  isAIza: k.startsWith('AIzaSy'),
  hasSpecialChars: /[^a-zA-Z0-9_\-]/.test(k)
});
