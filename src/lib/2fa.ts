// 2FA Utility Functions
import speakeasy from 'speakeasy';
import { prisma } from './prisma';
import { isDatabaseEnabled } from './db-config';

// Verify 2FA token (for login)
export async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  if (!isDatabaseEnabled() || !prisma) return false;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    return verified;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

