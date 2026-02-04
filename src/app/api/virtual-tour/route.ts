import { NextRequest, NextResponse } from 'next/server';
import { virtualTourBookingSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = virtualTourBookingSchema.parse(body);

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Dynamic import to avoid errors if Resend is not installed
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const adminEmail = process.env.ADMIN_EMAIL || 'info@martindokshomes.com';

      // Send confirmation to user
      await resend.emails.send({
        from: process.env.TOURS_FROM || 'Martin Doks Homes <tours@martindokshomes.com>',
        to: validatedData.email,
        subject: 'Virtual Tour Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #efb105;">Virtual Tour Booking Confirmed</h1>
            <p>Dear ${validatedData.name},</p>
            <p>Your virtual tour has been scheduled for:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Date:</strong> ${new Date(validatedData.preferredDate).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${validatedData.preferredTime}</p>
            </div>
            <p>We'll contact you within 24 hours to confirm the details and provide the tour link.</p>
            <p>If you need to reschedule or have any questions, please contact us at <strong>+2349139694471</strong> or reply to this email.</p>
            <p>Best regards,<br><strong>Martin Doks Homes Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
              Email: info@martindokshomes.com | Phone: +2349139694471
            </p>
          </div>
        `,
      });

      // Notify admin
      await resend.emails.send({
        from: process.env.TOURS_FROM || 'Martin Doks Homes <tours@martindokshomes.com>',
        to: adminEmail,
        subject: 'New Virtual Tour Booking',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #efb105;">New Virtual Tour Booking</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Date:</strong> ${new Date(validatedData.preferredDate).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${validatedData.preferredTime}</p>
            ${validatedData.propertyId ? `<p><strong>Property ID:</strong> ${validatedData.propertyId}</p>` : ''}
            ${validatedData.message ? `<p><strong>Message:</strong><br>${validatedData.message}</p>` : ''}
          </div>
        `,
      });
    } else {
      // Log if Resend is not configured
      console.log('Virtual tour booking (Resend not configured):', validatedData);
    }

    return NextResponse.json(
      { message: 'Virtual tour booking request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Virtual tour booking error:', error);
    return NextResponse.json(
      { message: 'Failed to process booking request' },
      { status: 400 }
    );
  }
}

