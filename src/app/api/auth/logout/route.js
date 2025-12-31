import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete auth cookie
    cookieStore.delete('auth_token');

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('[auth/logout] Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
