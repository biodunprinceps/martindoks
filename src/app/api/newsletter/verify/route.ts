import { NextRequest, NextResponse } from 'next/server';
import { verifySubscriber, findSubscriberByToken } from '@/lib/newsletter-storage';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the subscriber
    const subscriber = await verifySubscriber(token);

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 404 }
      );
    }

    // Send welcome email after verification
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.NEWSLETTER_FROM || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        await resend.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: 'Welcome to Martin Doks Homes Newsletter!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #efb105 0%, #d9a004 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #000; margin: 0; font-size: 28px;">Welcome to Our Newsletter!</h1>
              </div>
              <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e5e5;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  Thank you for verifying your email address! You're now subscribed to the Martin Doks Homes newsletter.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  You'll receive weekly updates about our projects, industry insights, construction tips, and company news.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Stay tuned for the latest developments from Martin Doks Homes!
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Best regards,<br>
                  <strong style="color: #efb105;">Martin Doks Homes Team</strong>
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail verification if welcome email fails
      }
    }

    return NextResponse.json(
      { 
        message: 'Your email has been verified successfully! You are now subscribed to our newsletter.',
        email: subscriber.email
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification. Please try again later.' },
      { status: 500 }
    );
  }
}

