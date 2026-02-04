import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Dynamic import to avoid errors if Resend is not installed
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const adminEmail = process.env.ADMIN_EMAIL || 'info@martindokshomes.com';

      // Send to admin
      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <contact@martindokshomes.com>',
        to: adminEmail,
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #efb105;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${validatedData.message}</p>
          </div>
        `,
      });

      // Auto-reply to user
      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: validatedData.email,
        subject: 'Thank you for contacting Martin Doks Homes',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #efb105;">Thank you for reaching out!</h1>
            <p>Dear ${validatedData.name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>If your inquiry is urgent, please call us at <strong>+2349139694471</strong>.</p>
            <p>Best regards,<br><strong>Martin Doks Homes Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
              Email: info@martindokshomes.com | Phone: +2349139694471
            </p>
          </div>
        `,
      });
    } else {
      // Log if Resend is not configured
      console.log('Contact form submission (Resend not configured):', validatedData);
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to submit contact form' },
      { status: 400 }
    );
  }
}

