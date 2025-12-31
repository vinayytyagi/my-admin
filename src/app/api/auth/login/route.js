import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Hardcoded credentials (in production, store hashed password in env)
const VALID_EMAIL = 'dev@xenotix.co.in';
const VALID_PASSWORD = 'Ujjwal@962.';
const JWT_SECRET = process.env.JWT_SECRET || 'xenotix-admin-jwt-secret-key-2024';

// Simple JWT-like token generation
function generateToken(email) {
  const payload = {
    email,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    iat: Date.now()
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadStr)
    .digest('hex');
  return `${payloadStr}.${signature}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate credentials
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(email);

    // Create response and set cookie using response.cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    });

    // Set HTTP-only cookie via response
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true, // Always secure on production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('[auth/login] Error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
