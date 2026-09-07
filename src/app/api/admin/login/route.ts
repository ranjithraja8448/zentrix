import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Standard Admin credentials
    const validUser = 'admin';
    const validPass = 'kavery@symposium2k26';

    if (username === validUser && password === validPass) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated_tkec_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Admin authenticated successfully!' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login authentication failed' },
      { status: 500 }
    );
  }
}
