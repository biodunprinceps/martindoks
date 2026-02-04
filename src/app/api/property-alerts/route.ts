import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const alertSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  alertTypes: z.array(z.enum(['new', 'price', 'status'])).min(1, 'Select at least one alert type'),
  criteria: z.object({
    type: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = alertSchema.parse(body);

    // In a real implementation, you would:
    // 1. Store the alert in a database
    // 2. Set up a cron job to check for matching properties
    // 3. Send email/SMS notifications when matches are found

    // For now, we'll just log it and return success
    console.log('Property alert created:', validatedData);

    // Check if Resend is configured for email notifications
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      // Send confirmation email
      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: validatedData.email,
        subject: 'Property Alert Confirmation - Martin Doks Homes',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #efb105;">Property Alert Confirmed</h1>
            <p>Thank you for setting up a property alert!</p>
            <p>We'll notify you when:</p>
            <ul>
              ${validatedData.alertTypes.includes('new') ? '<li>New properties matching your criteria are added</li>' : ''}
              ${validatedData.alertTypes.includes('price') ? '<li>Properties matching your criteria have price changes</li>' : ''}
              ${validatedData.alertTypes.includes('status') ? '<li>Properties matching your criteria change status</li>' : ''}
            </ul>
            <p>You can manage your alerts in your account settings.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
              Email: info@martindokshomes.com | Phone: +2349139694471
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { message: 'Property alert created successfully', alertId: `alert_${Date.now()}` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Property alert error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property alert' },
      { status: 400 }
    );
  }
}

