import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'vasil-portfolio-session-secret-key-2027';

// Generate HMAC signed session token
export function generateAdminToken(email: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = JSON.stringify({ email, expiresAt });
  const base64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');
  return `${base64Payload}.${signature}`;
}

// Verify HMAC session token
export function verifyAdminToken(token: string): { valid: boolean; email?: string; error?: string } {
  try {
    if (!token || !token.includes('.')) {
      return { valid: false, error: 'Malformed authorization token' };
    }
    const [base64Payload, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false, error: 'Invalid token signature' };
    }
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session token expired' };
    }
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false, error: 'Token verification failed' };
  }
}
