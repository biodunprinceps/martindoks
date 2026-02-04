import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser, initializeDefaultUsers } from '@/lib/user-storage';

export async function GET() {
  try {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    return NextResponse.json({ users: usersWithoutPasswords });
  } catch (error: any) {
    console.error('Error loading users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validate username length
    if (body.username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 3) {
      return NextResponse.json(
        { error: 'Password must be at least 3 characters' },
        { status: 400 }
      );
    }

    const user = await createUser({
      username: body.username,
      password: body.password,
      role: body.role || 'editor',
      permissions: body.permissions || [],
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 400 }
    );
  }
}

