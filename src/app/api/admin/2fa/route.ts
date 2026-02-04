import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/db-config';

// GET - Get 2FA status or generate secret
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action'); // 'status' or 'generate'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (isDatabaseEnabled() && prisma) {
      const user = await prisma.adminUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          twoFactorEnabled: true,
          twoFactorSecret: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (action === 'generate') {
        // Generate new secret
        const secret = speakeasy.generateSecret({
          name: `Martin Doks Homes (${user.username})`,
          issuer: 'Martin Doks Homes',
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

        return NextResponse.json({
          secret: secret.base32,
          qrCode: qrCodeUrl,
          manualEntryKey: secret.base32,
        });
      }

      return NextResponse.json({
        enabled: user.twoFactorEnabled,
        hasSecret: !!user.twoFactorSecret,
      });
    } else {
      return NextResponse.json(
        { error: '2FA requires database' },
        { status: 501 }
      );
    }
  } catch (error: any) {
    console.error('Error handling 2FA request:', error);
    return NextResponse.json(
      { error: 'Failed to process 2FA request' },
      { status: 500 }
    );
  }
}

// POST - Enable/disable 2FA or verify token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, token, secret } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (isDatabaseEnabled() && prisma) {
      if (action === 'verify') {
        // Verify token and enable 2FA
        if (!token || !secret) {
          return NextResponse.json(
            { error: 'Token and secret are required' },
            { status: 400 }
          );
        }

        const verified = speakeasy.totp.verify({
          secret,
          encoding: 'base32',
          token,
          window: 2, // Allow 2 time steps (60 seconds) of tolerance
        });

        if (!verified) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 400 }
          );
        }

        // Enable 2FA for user
        await prisma.adminUser.update({
          where: { id: userId },
          data: {
            twoFactorEnabled: true,
            twoFactorSecret: secret, // In production, encrypt this
          },
        });

        return NextResponse.json({ success: true, enabled: true });
      }

      if (action === 'disable') {
        await prisma.adminUser.update({
          where: { id: userId },
          data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
            backupCodes: [],
          },
        });

        return NextResponse.json({ success: true, enabled: false });
      }

      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: '2FA requires database' },
        { status: 501 }
      );
    }
  } catch (error: any) {
    console.error('Error processing 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to process 2FA' },
      { status: 500 }
    );
  }
}

// verify2FAToken moved to src/lib/2fa.ts

