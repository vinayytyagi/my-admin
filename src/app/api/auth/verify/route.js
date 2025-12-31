import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'xenotix-admin-jwt-secret-key-2024';

// Verify token signature and expiration
function verifyToken(token) {
  try {
    const [payloadStr, signature] = token.split('.');
    
    if (!payloadStr || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadStr)
      .digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode and verify expiration
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString());
    
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      authenticated: true,
      user: { email: payload.email }
    });

  } catch (error) {
    console.error('[auth/verify] Error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
