import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, initializeDefaultUsers } from '@/lib/user-storage';

export async function POST(request: NextRequest) {
  try {
    // Initialize default users on first request
    await initializeDefaultUsers();
    
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ 
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to authenticate' },
      { status: 500 }
    );
  }
}

