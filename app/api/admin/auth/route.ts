import { NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Server configuration error: credentials not set.' },
        { status: 500 },
      );
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    await createSession('admin');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
