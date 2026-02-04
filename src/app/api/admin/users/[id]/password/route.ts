import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/user-storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, currentPassword } = body;
    
    if (!password) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    if (password.length < 3) {
      return NextResponse.json(
        { error: 'Password must be at least 3 characters' },
        { status: 400 }
      );
    }

    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If currentPassword is provided, verify it
    if (currentPassword && user.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const updatedUser = await updateUser(id, { password });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ 
      user: userWithoutPassword,
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password' },
      { status: 400 }
    );
  }
}

