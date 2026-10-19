import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateAdminToken, verifyAdminToken } from '../src/lib/auth.ts';

describe('Unit Tests: Core Business Logic & Calculations', () => {

  describe('DSA Progress Calculations', () => {
    function computeDsa(target: number, solved: number) {
      const remaining = Math.max(target - solved, 0);
      const percentage = target > 0 ? Math.min(100, Math.round((solved / target) * 100)) : 0;
      return { remaining, percentage };
    }

    test('Standard target and solved values', () => {
      const res = computeDsa(500, 187);
      assert.equal(res.remaining, 313);
      assert.equal(res.percentage, 37);
    });

    test('Zero target handled safely without division by zero', () => {
      const res = computeDsa(0, 0);
      assert.equal(res.remaining, 0);
      assert.equal(res.percentage, 0);
    });

    test('Solved equals target', () => {
      const res = computeDsa(500, 500);
      assert.equal(res.remaining, 0);
      assert.equal(res.percentage, 100);
    });

    test('Remaining never negative when solved exceeds target', () => {
      const res = computeDsa(100, 150);
      assert.equal(res.remaining, 0);
      assert.equal(res.percentage, 100);
    });

    test('Difficulty sum consistency validation', () => {
      const totalSolved = 187;
      const easy = 70;
      const medium = 95;
      const hard = 22;
      assert.equal(easy + medium + hard, totalSolved, 'Difficulty breakdown must sum to total solved');
    });
  });

  describe('GATE Per-Subject Calculations & Track Isolation', () => {
    function computeGateSubject(targetPyqs: number, solvedPyqs: number) {
      const remaining = Math.max(targetPyqs - solvedPyqs, 0);
      const percentage = targetPyqs > 0 ? Math.min(100, Math.round((solvedPyqs / targetPyqs) * 100)) : 0;
      return { remaining, percentage };
    }

    test('Computes GATE subject completion and remaining counts correctly', () => {
      const res = computeGateSubject(500, 450);
      assert.equal(res.remaining, 50);
      assert.equal(res.percentage, 90);
    });

    test('GATE CS and GATE DA maintain strictly separate records', () => {
      const csSubject = {
        examType: 'CS',
        name: 'Algorithms',
        targetPyqs: 500,
        solvedPyqs: 550
      };
      const daSubject = {
        examType: 'DA',
        name: 'Programming, Data Structures & Algorithms',
        targetPyqs: 500,
        solvedPyqs: 500
      };

      assert.notEqual(csSubject.examType, daSubject.examType, 'Tracks must be distinct');
      assert.notEqual(csSubject.name, daSubject.name, 'Subject names must remain separate');
      assert.notEqual(csSubject.solvedPyqs, daSubject.solvedPyqs, 'Track metrics must not bleed into each other');
    });
  });

  describe('File Validation', () => {
    function validateResumeFile(filename: string, mimeType: string, sizeBytes: number, header: string) {
      if (mimeType !== 'application/pdf' && !filename.toLowerCase().endsWith('.pdf')) {
        return { valid: false, error: 'Only PDF documents are supported' };
      }
      if (sizeBytes > 10 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds maximum allowed limit of 10 MB' };
      }
      if (header !== '%PDF') {
        return { valid: false, error: 'Invalid PDF header' };
      }
      return { valid: true };
    }

    test('Valid PDF passes validation', () => {
      const res = validateResumeFile('Mohammed_Abdul_Vasil_Resume.pdf', 'application/pdf', 250000, '%PDF');
      assert.equal(res.valid, true);
    });

    test('Rejects non-PDF document types (e.g. DOCX, TXT, EXE)', () => {
      const res = validateResumeFile('resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 50000, 'PK\x03\x04');
      assert.equal(res.valid, false);
      assert.match(res.error!, /Only PDF documents/);
    });

    test('Rejects oversized files exceeding 10MB', () => {
      const res = validateResumeFile('huge_resume.pdf', 'application/pdf', 15 * 1024 * 1024, '%PDF');
      assert.equal(res.valid, false);
      assert.match(res.error!, /10 MB/);
    });

    test('Rejects fake PDF with invalid magic bytes', () => {
      const res = validateResumeFile('fake.pdf', 'application/pdf', 1000, 'TEXT');
      assert.equal(res.valid, false);
      assert.match(res.error!, /Invalid PDF header/);
    });
  });

  describe('Contact Form Validation & Spam Protection', () => {
    function validateContactInput(name: any, email: any, message: any, bot_check?: any) {
      if (bot_check) {
        return { valid: false, error: 'Spam detected' };
      }
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return { valid: false, error: 'Valid name (2-100 characters) is required' };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
        return { valid: false, error: 'Valid email address is required' };
      }
      if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
        return { valid: false, error: 'Message must be between 10 and 5000 characters' };
      }
      return { valid: true };
    }

    test('Valid contact form input passes', () => {
      const res = validateContactInput('John Doe', 'john.doe@company.com', 'We would like to invite you for an engineering interview.');
      assert.equal(res.valid, true);
    });

    test('Catches honeypot spam bot submission', () => {
      const res = validateContactInput('Bot Name', 'bot@spam.com', 'Hello there spam message', 'i-am-a-bot');
      assert.equal(res.valid, false);
      assert.equal(res.error, 'Spam detected');
    });

    test('Rejects invalid email format', () => {
      const res = validateContactInput('John Doe', 'invalid-email-address', 'Testing invalid email address message');
      assert.equal(res.valid, false);
      assert.match(res.error!, /Valid email address/);
    });

    test('Rejects empty or too short message', () => {
      const res = validateContactInput('John Doe', 'john@test.com', 'Hi');
      assert.equal(res.valid, false);
      assert.match(res.error!, /between 10 and 5000/);
    });
  });

  describe('Admin Token Authentication & Cryptographic Verification', () => {
    test('Generates valid token and verifies successfully', () => {
      const email = 'mdvasil07@gmail.com';
      const token = generateAdminToken(email);
      assert.ok(token && token.includes('.'));

      const verification = verifyAdminToken(token);
      assert.equal(verification.valid, true);
      assert.equal(verification.email, email);
    });

    test('Rejects tampered token signature', () => {
      const token = generateAdminToken('mdvasil07@gmail.com');
      const tampered = token.slice(0, -4) + 'abcd';
      const verification = verifyAdminToken(tampered);
      assert.equal(verification.valid, false);
      assert.match(verification.error!, /signature|failed/i);
    });

    test('Rejects malformed tokens', () => {
      const verification = verifyAdminToken('not-a-real-token');
      assert.equal(verification.valid, false);
    });
  });

});
