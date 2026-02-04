import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';
import { createSubscriber, findSubscriberByEmail } from '@/lib/newsletter-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { 
          message: 'Email service not configured. Please contact support.',
          error: 'RESEND_API_KEY missing'
        },
        { status: 500 }
      );
    }

    // Check if email already exists
    const existing = await findSubscriberByEmail(validatedData.email);
    if (existing?.verified) {
      return NextResponse.json(
        { message: 'This email is already subscribed and verified.' },
        { status: 200 }
      );
    }

    // Create or update subscriber
    const subscriber = existing 
      ? await createSubscriber(validatedData.email) // Will update token if not verified
      : await createSubscriber(validatedData.email);

    // Dynamic import to avoid errors if Resend is not installed
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const fromEmail = process.env.NEWSLETTER_FROM || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // Get the site URL - detect local development and use HTTP
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
    
    if (!siteUrl) {
      // Try to get from request headers
      const host = request.headers.get('host') || 'localhost:3000';
      // Check if it's localhost or IP address (local development)
      const isLocal = host.includes('localhost') || /^\d+\.\d+\.\d+\.\d+(:\d+)?$/.test(host);
      const protocol = isLocal ? 'http' : 'https';
      siteUrl = `${protocol}://${host}`;
    }
    
    // Force HTTP for localhost/IP addresses (local development)
    // This prevents SSL errors when accessing via IP address
    if (siteUrl.includes('localhost') || /https?:\/\/(\d+\.\d+\.\d+\.\d+)/.test(siteUrl)) {
      siteUrl = siteUrl.replace(/^https:/, 'http:');
    } else if (!siteUrl.startsWith('http')) {
      // If no protocol specified, default to https for production domains
      siteUrl = `https://${siteUrl}`;
    }
    
    const verificationUrl = `${siteUrl}/verify-email?token=${subscriber.verificationToken}`;
    
    // Send verification email
    try {
      const verificationEmailResult = await resend.emails.send({
        from: fromEmail,
        to: validatedData.email,
        subject: 'Verify Your Email - Martin Doks Homes Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #efb105 0%, #d9a004 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #000; margin: 0; font-size: 28px;">Verify Your Email</h1>
            </div>
            <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e5e5;">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to Martin Doks Homes newsletter!
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: #efb105; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #efb105; word-break: break-all;">${verificationUrl}</a>
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                If you didn't subscribe to our newsletter, you can safely ignore this email.
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Best regards,<br>
                <strong style="color: #efb105;">Martin Doks Homes Team</strong>
              </p>
            </div>
          </div>
        `,
      });

      console.log('Verification email sent:', verificationEmailResult);

      // Notify admin
      const adminEmail = process.env.ADMIN_EMAIL || 'info@martindokshomes.com';
      try {
        const adminEmailResult = await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: 'New Newsletter Subscription (Pending Verification)',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #efb105;">New Newsletter Subscription</h2>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Status:</strong> Pending verification</p>
            </div>
          `,
        });
        console.log('Admin notification sent:', adminEmailResult);
      } catch (adminError) {
        console.error('Failed to send admin notification:', adminError);
        // Don't fail the request if admin email fails
      }
    } catch (emailError: any) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { 
          message: 'Failed to send verification email. Please try again later.',
          error: emailError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Please check your email to verify your subscription.',
        requiresVerification: true
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isValidationError = error?.issues || error?.name === 'ZodError';
    
    return NextResponse.json(
      { 
        message: isValidationError ? 'Invalid email address' : 'Failed to subscribe to newsletter',
        error: errorMessage
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}

