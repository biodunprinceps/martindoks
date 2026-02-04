import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, property } = body;

    if (!email || !property) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: email,
        subject: `New Property Alert: ${property.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #efb105;">New Property Available!</h1>
            <p>We have a new property that matches your criteria:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">${property.title}</h2>
              <p><strong>Location:</strong> ${property.location}</p>
              ${property.price ? `<p><strong>Price:</strong> ₦${property.price.toLocaleString()}</p>` : ''}
              <p><strong>Type:</strong> ${property.type}</p>
              <p><strong>Status:</strong> ${property.status}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://martindokshomes.com/properties/${property.slug}" 
                 style="background: #efb105; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View Property Details
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
              Email: info@martindokshomes.com | Phone: +2349139694471<br>
              <a href="https://martindokshomes.com" style="color: #efb105;">www.martindokshomes.com</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json(
        { message: 'Notification sent successfully' },
        { status: 200 }
      );
    } else {
      console.log('New property notification (Resend not configured):', { email, property });
      return NextResponse.json(
        { message: 'Email service not configured. Notification logged to console.' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error sending new property notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

