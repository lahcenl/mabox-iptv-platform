/**
 * lib/session.ts
 * Server-only session utilities using native Web Crypto API (no external deps).
 * Uses HMAC-SHA256 signed JWT-like tokens stored in HttpOnly cookies.
 */
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecretKey(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET environment variable is not set.');
  return secret;
}

/** Base64url encode (URL-safe, no padding) */
function base64urlEncode(data: Uint8Array): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Base64url decode */
function base64urlDecode(str: string): Buffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
}

/** Import HMAC-SHA256 key from raw secret string */
async function importKey(secret: string): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export interface SessionPayload {
  userId: string;
  expiresAt: number; // Unix timestamp (ms)
}

/**
 * Create a signed token: base64url(header).base64url(payload).base64url(signature)
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  const header = base64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256' })));
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${header}.${body}`;

  const key = await importKey(getSecretKey());
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signingInput),
  );
  const signature = base64urlEncode(new Uint8Array(signatureBuffer));

  return `${signingInput}.${signature}`;
}

/**
 * Verify and decode a token. Returns the payload or null if invalid/expired.
 */
export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const signingInput = `${header}.${body}`;

    const key = await importKey(getSecretKey());
    const expectedSig = new Uint8Array(base64urlDecode(signature));

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      expectedSig,
      new TextEncoder().encode(signingInput),
    );
    if (!valid) return null;

    const payload: SessionPayload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body)),
    );

    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Create a session and set the HttpOnly cookie */
export async function createSession(userId: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
}

/** Read and verify the current session from cookies */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
}

/** Delete the session cookie (logout) */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
