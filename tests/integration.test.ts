import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';
dotenv.config();

import { app } from '../server.ts';

const BASE_URL = 'http://localhost:3000';
let adminToken = '';
let serverInstance: any = null;

before(async () => {
  try {
    await fetch(`${BASE_URL}/api/dsa/overall`);
  } catch {
    serverInstance = app.listen(3000);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
});

after(() => {
  if (serverInstance) {
    serverInstance.closeAllConnections?.();
    serverInstance.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 500).unref();
  }
});

describe('Integration Tests: End-to-End API, Database & Storage', () => {

  describe('1. Admin Authentication & Authorization Checks', () => {
    test('Rejects login with invalid credentials (401)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'mdvasil07@gmail.com', password: 'wrong-password-xyz' })
      });
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /invalid admin credentials/i);
    });

    test('Rejects login with missing fields (400)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'mdvasil07@gmail.com' })
      });
      assert.equal(res.status, 400);
    });

    test('Authenticates successfully with valid admin credentials (200)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL || 'mdvasil07@gmail.com',
          password: process.env.ADMIN_PASSWORD || 'VasilAdmin#2027Secure'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.token, 'Must return signed session token');
      adminToken = data.token;
    });

    test('Verifies valid session token via /api/admin/verify (200)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.authenticated, true);
      assert.equal(data.email, (process.env.ADMIN_EMAIL || 'mdvasil07@gmail.com').toLowerCase());
    });

    test('Rejects unauthenticated requests to protected admin routes (401)', async () => {
      const endpoints = [
        { path: '/api/admin/verify', method: 'GET' },
        { path: '/api/admin/contacts', method: 'GET' },
        { path: '/api/admin/dsa/overall', method: 'POST', body: { target: 500, solved: 187 } },
        { path: '/api/admin/gate/subject', method: 'POST', body: { exam_type: 'CS', name: 'Algorithms', target_pyqs: 500, solved_pyqs: 400 } },
        { path: '/api/admin/resume/upload', method: 'POST', body: { filename: 'test.pdf', base64Data: 'abc' } }
      ];

      for (const ep of endpoints) {
        const res = await fetch(`${BASE_URL}${ep.path}`, {
          method: ep.method,
          headers: { 'Content-Type': 'application/json' },
          body: ep.body ? JSON.stringify(ep.body) : undefined
        });
        assert.equal(res.status, 401, `Expected 401 Unauthorized on unauthenticated ${ep.method} ${ep.path}`);
      }
    });
  });

  describe('2. Overall DSA Numerical Progress Flow', () => {
    test('Validates input bounds (solved cannot exceed target)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/dsa/overall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          target: 200,
          solved: 350 // Invalid: solved > target
        })
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /cannot exceed/i);
    });

    test('Persists overall numerical DSA progress to PostgreSQL', async () => {
      const payload = {
        target: 600,
        solved: 215,
        attempted: 240,
        easy: 80,
        medium: 110,
        hard: 25,
        platform: 'LeetCode'
      };

      const saveRes = await fetch(`${BASE_URL}/api/admin/dsa/overall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      assert.equal(saveRes.status, 200);
      const saveData = await saveRes.json();
      assert.equal(saveData.success, true);
      assert.equal(saveData.data.target, 600);
      assert.equal(saveData.data.solved, 215);
      assert.equal(saveData.data.remaining, 385);
      assert.equal(saveData.data.percentage, 36);

      // Re-fetch from public endpoint and verify persistence
      const getRes = await fetch(`${BASE_URL}/api/dsa/overall`);
      assert.equal(getRes.status, 200);
      const getData = await getRes.json();
      assert.equal(getData.target, 600);
      assert.equal(getData.solved, 215);
      assert.equal(getData.remaining, 385);
      assert.equal(getData.percentage, 36);
      assert.equal(getData.easy, 80);
      assert.equal(getData.medium, 110);
      assert.equal(getData.hard, 25);
    });
  });

  describe('3. GATE CS & DA Subject Numerical Progress Flow', () => {
    test('Updates a specific GATE CS subject and verifies database persistence', async () => {
      const updatePayload = {
        exam_type: 'CS',
        name: 'Operating Systems',
        target_pyqs: 500,
        solved_pyqs: 485,
        attempted_pyqs: 490,
        revision_rounds: 3,
        notes: 'Integration test automated verification'
      };

      const res = await fetch(`${BASE_URL}/api/admin/gate/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatePayload)
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.subject.targetPyqs, 500);
      assert.equal(data.subject.solvedPyqs, 485);
      assert.equal(data.subject.remainingPyqs, 15);
      assert.equal(data.subject.completionPercentage, 97);

      // Verify public query retrieves updated subject
      const pubRes = await fetch(`${BASE_URL}/api/gate/subjects`);
      assert.equal(pubRes.status, 200);
      const pubData = await pubRes.json();
      const osSubject = pubData.cs.find((s: any) => s.name === 'Operating Systems');
      assert.ok(osSubject, 'Operating Systems subject must exist in GATE CS track');
      assert.equal(osSubject.solvedPyqs, 485);
      assert.equal(osSubject.targetPyqs, 500);
      assert.equal(osSubject.remainingPyqs, 15);
      assert.equal(osSubject.completionPercentage, 97);
    });

    test('Verifies GATE DA subjects remain independent from GATE CS', async () => {
      const pubRes = await fetch(`${BASE_URL}/api/gate/subjects`);
      const pubData = await pubRes.json();
      assert.equal(pubData.cs.length, 10, 'Must have 10 GATE CS subjects');
      assert.equal(pubData.da.length, 7, 'Must have 7 GATE DA subjects');

      const mlSubject = pubData.da.find((s: any) => s.name === 'Machine Learning');
      assert.ok(mlSubject, 'Machine Learning must exist in GATE DA');
      assert.equal(mlSubject.examType, 'DA');
    });
  });

  describe('4. Résumé Storage, Metadata & Download Flow', () => {
    test('Rejects invalid file type during upload (400)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/resume/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          filename: 'malicious.exe',
          mimeType: 'application/octet-stream',
          base64Data: Buffer.from('MZ...fake executable').toString('base64')
        })
      });
      assert.equal(res.status, 400);
    });

    test('Uploads genuine PDF, stores in Supabase, and persists metadata in PostgreSQL', async () => {
      const dummyPdf = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n185\n%%EOF';
      const base64Data = Buffer.from(dummyPdf).toString('base64');

      const uploadRes = await fetch(`${BASE_URL}/api/admin/resume/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          filename: 'Mohammed_Abdul_Vasil_Resume_Official.pdf',
          mimeType: 'application/pdf',
          base64Data
        })
      });

      assert.equal(uploadRes.status, 200);
      const uploadData = await uploadRes.json();
      assert.equal(uploadData.success, true);
      assert.ok(uploadData.document.id, 'Must return inserted PostgreSQL document ID');
      assert.ok(uploadData.document.storagePath, 'Must return storage path');
      assert.ok(uploadData.document.publicUrl, 'Must return public URL');

      // Verify public retrieval
      const latestRes = await fetch(`${BASE_URL}/api/resume/latest`);
      assert.equal(latestRes.status, 200);
      const latestData = await latestRes.json();
      assert.equal(latestData.document.filename, 'Mohammed_Abdul_Vasil_Resume_Official.pdf');
      assert.ok(latestData.document.publicUrl);

      // Verify download endpoint streams the real PDF
      const dlRes = await fetch(`${BASE_URL}/api/resume/download`);
      assert.equal(dlRes.status, 200);
      assert.equal(dlRes.headers.get('content-type'), 'application/pdf');
      assert.match(dlRes.headers.get('content-disposition') || '', /attachment/);
    });
  });

  describe('5. Contact Submission & Status Integrity', () => {
    test('Validates contact form inputs and persists to database', async () => {
      const contactPayload = {
        name: 'Technical Recruiter',
        email: 'recruiter@faang.com',
        subject: 'Full Stack & AI Roles',
        message: 'Hello Vasil, we reviewed your TrainETA project and GATE preparation credentials. Excellent work.'
      };

      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactPayload)
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.status, 'accepted_by_server');

      // Verify admin can inspect the submission
      const adminRes = await fetch(`${BASE_URL}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      assert.equal(adminRes.status, 200);
      const adminData = await adminRes.json();
      const match = adminData.submissions.find((s: any) => s.email === 'recruiter@faang.com');
      assert.ok(match, 'Contact submission must be retrieved from database for admin inspection');
      assert.equal(match.status, 'accepted_by_server');
    });

    test('Enforces honeypot spam protection', async () => {
      const spamPayload = {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        subject: 'Spam',
        message: 'This is spam from an automated crawler bot.',
        bot_check: 'i-am-a-bot'
      };

      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spamPayload)
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /spam/i);
    });
  });

});
