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

    const priceDrop = property.oldPrice - property.newPrice;
    const priceDropPercent = ((priceDrop / property.oldPrice) * 100).toFixed(1);

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: email,
        subject: `Price Drop Alert: ${property.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #efb105;">💰 Price Drop Alert!</h1>
            <p>Great news! The price for a property you're interested in has dropped:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">${property.title}</h2>
              <p><strong>Location:</strong> ${property.location}</p>
              <div style="margin: 15px 0; padding: 15px; background: #fff; border-left: 4px solid #efb105;">
                <p style="margin: 0; text-decoration: line-through; color: #999;">
                  Old Price: ₦${property.oldPrice.toLocaleString()}
                </p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #efb105;">
                  New Price: ₦${property.newPrice.toLocaleString()}
                </p>
                <p style="margin: 5px 0 0 0; color: #28a745;">
                  You save: ₦${priceDrop.toLocaleString()} (${priceDropPercent}% off!)
                </p>
              </div>
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
        { message: 'Price drop notification sent successfully' },
        { status: 200 }
      );
    } else {
      console.log('Price drop notification (Resend not configured):', { email, property });
      return NextResponse.json(
        { message: 'Email service not configured. Notification logged to console.' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error sending price drop notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

