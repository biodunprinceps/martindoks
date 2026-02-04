import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, calculatorType, data, results } = body;

    if (!email || !calculatorType || !results) {
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

      let emailContent = '';
      let subject = '';

      switch (calculatorType) {
        case 'monthly':
          subject = 'Your Monthly Payment Calculation - Martin Doks Homes';
          emailContent = generateMonthlyPaymentEmail(data, results);
          break;
        case 'downpayment':
          subject = 'Your Down Payment Calculation - Martin Doks Homes';
          emailContent = generateDownPaymentEmail(data, results);
          break;
        case 'affordability':
          subject = 'Your Affordability Calculation - Martin Doks Homes';
          emailContent = generateAffordabilityEmail(data, results);
          break;
        case 'comparison':
          subject = 'Your Mortgage Comparison Results - Martin Doks Homes';
          emailContent = generateComparisonEmail(data, results);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid calculator type' },
            { status: 400 }
          );
      }

      await resend.emails.send({
        from: process.env.CONTACT_FROM || 'Martin Doks Homes <info@martindokshomes.com>',
        to: email,
        subject,
        html: emailContent,
      });

      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      // Log if Resend is not configured
      console.log('Mortgage calculator email (Resend not configured):', { email, calculatorType });
      return NextResponse.json(
        { message: 'Email service not configured. Results logged to console.' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Mortgage calculator email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function generateMonthlyPaymentEmail(data: any, results: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #efb105;">Monthly Payment Calculation</h1>
      <p>Thank you for using the Martin Doks Homes Mortgage Calculator!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Your Input</h2>
        ${data.propertyValue ? `<p><strong>Property Value:</strong> ${formatCurrency(data.propertyValue)}</p>` : ''}
        ${data.downPayment ? `<p><strong>Down Payment:</strong> ${formatCurrency(data.downPayment)}</p>` : ''}
        <p><strong>Loan Amount:</strong> ${formatCurrency(data.loanAmount)}</p>
        <p><strong>Interest Rate:</strong> ${data.interestRate}% per annum</p>
        <p><strong>Loan Term:</strong> ${data.loanTerm} years</p>
      </div>

      <div style="background: #efb105; color: #000; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Payment Summary</h2>
        <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">
          Monthly Payment: ${formatCurrency(results.monthlyPayment)}
        </p>
        <p><strong>Total Interest:</strong> ${formatCurrency(results.totalInterest)}</p>
        <p><strong>Total Payment:</strong> ${formatCurrency(results.totalPayment)}</p>
      </div>

      <p style="margin-top: 30px;">
        <strong>Next Steps:</strong><br>
        • Contact us to discuss your mortgage options<br>
        • Explore our available properties<br>
        • Schedule a consultation with our team
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
        Email: info@martindokshomes.com | Phone: +2349139694471<br>
        <a href="https://martindokshomes.com" style="color: #efb105;">www.martindokshomes.com</a>
      </p>
    </div>
  `;
}

function generateDownPaymentEmail(data: any, results: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #efb105;">Down Payment Calculation</h1>
      <p>Thank you for using the Martin Doks Homes Mortgage Calculator!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Your Input</h2>
        ${data.propertyValue ? `<p><strong>Property Value:</strong> ${formatCurrency(data.propertyValue)}</p>` : ''}
        <p><strong>Down Payment:</strong> ${formatCurrency(results.downPayment)} (${results.percent}%)</p>
      </div>

      <div style="background: #efb105; color: #000; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Summary</h2>
        ${data.propertyValue ? `<p><strong>Property Value:</strong> ${formatCurrency(data.propertyValue)}</p>` : ''}
        <p><strong>Down Payment:</strong> ${formatCurrency(results.downPayment)}</p>
        <p><strong>Loan Amount Needed:</strong> ${formatCurrency(results.loanAmount)}</p>
      </div>

      <p style="margin-top: 30px;">
        <strong>Next Steps:</strong><br>
        • Contact us to discuss financing options<br>
        • Explore our available properties<br>
        • Schedule a consultation with our team
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
        Email: info@martindokshomes.com | Phone: +2349139694471<br>
        <a href="https://martindokshomes.com" style="color: #efb105;">www.martindokshomes.com</a>
      </p>
    </div>
  `;
}

function generateAffordabilityEmail(data: any, results: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #efb105;">Affordability Calculation</h1>
      <p>Thank you for using the Martin Doks Homes Mortgage Calculator!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Your Input</h2>
        <p><strong>Monthly Income:</strong> ${formatCurrency(data.monthlyIncome)}</p>
        <p><strong>Monthly Debts:</strong> ${formatCurrency(data.monthlyDebts)}</p>
        <p><strong>Interest Rate:</strong> ${data.interestRate}% per annum</p>
        <p><strong>Loan Term:</strong> ${data.loanTerm} years</p>
        <p><strong>Down Payment:</strong> ${data.downPaymentPercent}%</p>
      </div>

      <div style="background: #efb105; color: #000; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Affordability Summary</h2>
        <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">
          Maximum Property Value: ${formatCurrency(results.maxPropertyValue)}
        </p>
        <p><strong>Maximum Monthly Payment:</strong> ${formatCurrency(results.maxMonthlyPayment)}</p>
        <p><strong>Maximum Loan Amount:</strong> ${formatCurrency(results.maxLoanAmount)}</p>
      </div>

      <p style="margin-top: 30px;">
        <strong>Next Steps:</strong><br>
        • Browse properties within your budget<br>
        • Contact us to discuss your options<br>
        • Schedule a consultation with our team
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
        Email: info@martindokshomes.com | Phone: +2349139694471<br>
        <a href="https://martindokshomes.com" style="color: #efb105;">www.martindokshomes.com</a>
      </p>
    </div>
  `;
}

function generateComparisonEmail(data: any, results: any): string {
  let scenariosHtml = '';
  results.scenarios.forEach((scenario: any, index: number) => {
    scenariosHtml += `
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <h3 style="margin-top: 0; color: #333;">Scenario ${index + 1}</h3>
        <p><strong>Property Value:</strong> ${formatCurrency(scenario.propertyValue)}</p>
        <p><strong>Down Payment:</strong> ${formatCurrency(scenario.downPayment)} (${scenario.downPaymentPercent}%)</p>
        <p><strong>Loan Amount:</strong> ${formatCurrency(scenario.loanAmount)}</p>
        <p><strong>Interest Rate:</strong> ${scenario.interestRate}%</p>
        <p><strong>Loan Term:</strong> ${scenario.loanTerm} years</p>
        <p style="font-size: 18px; font-weight: bold; color: #efb105; margin-top: 10px;">
          Monthly Payment: ${formatCurrency(scenario.monthlyPayment)}
        </p>
        <p><strong>Total Interest:</strong> ${formatCurrency(scenario.totalInterest)}</p>
        <p><strong>Total Payment:</strong> ${formatCurrency(scenario.totalPayment)}</p>
      </div>
    `;
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #efb105;">Mortgage Comparison Results</h1>
      <p>Thank you for using the Martin Doks Homes Mortgage Calculator!</p>
      
      <div style="background: #efb105; color: #000; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Comparison Summary</h2>
        ${scenariosHtml}
      </div>

      <p style="margin-top: 30px;">
        <strong>Next Steps:</strong><br>
        • Compare these scenarios with our team<br>
        • Explore properties matching your budget<br>
        • Schedule a consultation to discuss financing
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos<br>
        Email: info@martindokshomes.com | Phone: +2349139694471<br>
        <a href="https://martindokshomes.com" style="color: #efb105;">www.martindokshomes.com</a>
      </p>
    </div>
  `;
}

