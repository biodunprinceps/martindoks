import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, viewedProperty, similarProperties } = body;

    if (!email || !viewedProperty || !similarProperties || similarProperties.length === 0) {
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

      let propertiesHtml = '';
      similarProperties.forEach((prop: any) => {
        propertiesHtml += `
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin-top: 0; color: #333;">${prop.title}</h3>
            <p><strong>Location:</strong> ${prop.location}</p>
            ${prop.price ? `<p><strong>Price:</strong> ₦${prop.price.toLocaleString()}</p>` : ''}
            <p><strong>Type:</strong> ${prop.type}</p>
            <a href="https://martindokshomes.com/properties/${prop.slug}" 
               style="color: #efb105; text-decoration: none; font-weight: bold;">
              View Details →
            </a>
          </div>
        `;
      });

      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: email,
        subject: `Properties You Might Like - Similar to ${viewedProperty.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #efb105;">Properties You Might Like</h1>
            <p>Based on your interest in <strong>${viewedProperty.title}</strong>, here are some similar properties you might be interested in:</p>
            
            ${propertiesHtml}

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://martindokshomes.com/listings" 
                 style="background: #efb105; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View All Properties
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
        { message: 'Similar properties notification sent successfully' },
        { status: 200 }
      );
    } else {
      console.log('Similar properties notification (Resend not configured):', { email, viewedProperty, similarProperties });
      return NextResponse.json(
        { message: 'Email service not configured. Notification logged to console.' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error sending similar properties notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

