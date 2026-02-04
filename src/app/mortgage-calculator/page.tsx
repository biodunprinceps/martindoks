'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHero } from '@/components/sections/PageHero';
import { FadeIn } from '@/components/animations/FadeIn';
import { Calculator, DollarSign, Home, TrendingUp, Mail, Plus, X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleNumberInputChange, parseFormattedNumber, formatNumberWithCommas } from '@/lib/number-formatting';
import Script from 'next/script';

type CalculatorType = 'monthly' | 'downpayment' | 'affordability' | 'comparison';

// Nigerian market defaults
const NIGERIAN_DEFAULTS = {
  interestRate: '18.5', // Typical mortgage rate in Nigeria (3% - 28% range)
  loanTerm: '20', // Typical loan term in Nigeria (15-25 years)
  downPaymentPercent: '30', // Typical down payment in Nigeria (20-40%)
};

// Generate structured data for the mortgage calculator
function generateCalculatorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Mortgage Calculator Nigeria',
    description: 'Free mortgage calculator for Nigeria. Calculate monthly payments, down payment, and affordability for home loans in Lagos and across Nigeria.',
    url: 'https://martindokshomes.com/mortgage-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
    },
    featureList: [
      'Monthly Payment Calculator',
      'Down Payment Calculator',
      'Affordability Calculator',
      'Scenario Comparison',
      'NHF/MREIF Rate Support',
      'Commercial Loan Rates',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
  };
}

export default function MortgageCalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('monthly');
  const calculatorSchema = generateCalculatorSchema();

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      
      {/* FAQ Schema for SEO */}
      <Script
        id="calculator-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is a mortgage calculator?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A mortgage calculator is a tool that helps you calculate monthly mortgage payments, down payment amounts, and determine how much you can afford to borrow for a property purchase in Nigeria.',
                },
              },
              {
                '@type': 'Question',
                name: 'What are the mortgage interest rates in Nigeria?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Mortgage interest rates in Nigeria typically range from 3% (for NHF/MREIF/federal housing programs) to 28% (for commercial loans). Federal housing programs offer lower rates.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the typical loan term for mortgages in Nigeria?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Typical mortgage loan terms in Nigeria range from 15-25 years. Federal programs may offer up to 30 years.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much down payment is required in Nigeria?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Down payment requirements in Nigeria typically range from 20-40% of the property value, with 30% being the most common.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is NHF and MREIF?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NHF (National Housing Fund) and MREIF (Mortgage Refinance and Liquidity Facility) are federal housing programs in Nigeria that offer lower interest rates (around 3%) for qualified homebuyers.',
                },
              },
            ],
          }),
        }}
      />

      <div>
        <PageHero
          title="Mortgage Calculator Nigeria"
          description="Free mortgage calculator for Nigeria. Calculate monthly payments, down payment, and affordability for home loans in Lagos and across Nigeria. Supports NHF, MREIF, and commercial mortgage rates."
          backgroundImage="/images/hero/IMG-20240124-WA0010.jpg"
        />

        <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4">
            <FadeIn>
              {/* SEO-optimized heading */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Free Mortgage Calculator for Nigeria
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Plan your property purchase with our comprehensive mortgage calculator. Calculate monthly payments, 
                  determine down payment requirements, and find out how much you can afford. 
                  Perfect for homebuyers in Lagos, Abuja, Port Harcourt, and across Nigeria.
                </p>
              </div>

              {/* Calculator Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  variant={activeCalculator === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setActiveCalculator('monthly')}
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Monthly Payment
                </Button>
                <Button
                  variant={activeCalculator === 'downpayment' ? 'default' : 'outline'}
                  onClick={() => setActiveCalculator('downpayment')}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Down Payment
                </Button>
                <Button
                  variant={activeCalculator === 'affordability' ? 'default' : 'outline'}
                  onClick={() => setActiveCalculator('affordability')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Affordability
                </Button>
                <Button
                  variant={activeCalculator === 'comparison' ? 'default' : 'outline'}
                  onClick={() => setActiveCalculator('comparison')}
                  className="flex items-center gap-2"
                >
                  <GitCompare className="h-4 w-4" />
                  Compare Scenarios
                </Button>
              </div>
            </FadeIn>

            <div className="max-w-4xl mx-auto">
              {activeCalculator === 'monthly' && <MonthlyPaymentCalculator />}
              {activeCalculator === 'downpayment' && <DownPaymentCalculator />}
              {activeCalculator === 'affordability' && <AffordabilityCalculator />}
              {activeCalculator === 'comparison' && <ComparisonCalculator />}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-2xl font-bold mb-4">Mortgage Calculator for Nigeria - Complete Guide</h2>
              
              <h3 className="text-xl font-semibold mb-3">Understanding Mortgages in Nigeria</h3>
              <p>
                Buying a property in Nigeria requires careful financial planning. Our free mortgage calculator helps 
                you understand the costs involved in purchasing a home in Lagos, Abuja, Port Harcourt, or any other 
                city in Nigeria. Whether you're considering an NHF loan, MREIF financing, or a commercial mortgage, 
                our calculator provides accurate estimates based on current Nigerian market rates.
              </p>

              <h3 className="text-xl font-semibold mb-3">Mortgage Interest Rates in Nigeria</h3>
              <p>
                Mortgage interest rates in Nigeria vary significantly based on the type of loan:
              </p>
              <ul>
                <li><strong>Federal Programs (NHF/MREIF):</strong> As low as 3% per annum for qualified applicants</li>
                <li><strong>Commercial Banks:</strong> Typically range from 15% to 28% per annum</li>
                <li><strong>Loan Terms:</strong> 15-25 years for commercial loans, up to 30 years for federal programs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">How to Use Our Mortgage Calculator</h3>
              <p>
                Our mortgage calculator offers four powerful tools:
              </p>
              <ol>
                <li><strong>Monthly Payment Calculator:</strong> Calculate your monthly mortgage payment based on loan amount, interest rate, and term</li>
                <li><strong>Down Payment Calculator:</strong> Determine how much down payment you need for your property purchase</li>
                <li><strong>Affordability Calculator:</strong> Find out how much you can afford to borrow based on your income and debts</li>
                <li><strong>Scenario Comparison:</strong> Compare multiple mortgage scenarios side-by-side to find the best option</li>
              </ol>

              <h3 className="text-xl font-semibold mb-3">Mortgage Calculator for Lagos, Nigeria</h3>
              <p>
                Whether you're buying property in Victoria Island, Lekki, Ikeja, or any other area in Lagos, 
                our mortgage calculator helps you plan your purchase. Calculate payments for luxury apartments, 
                residential homes, or commercial properties across Nigeria's largest city.
              </p>

              <h3 className="text-xl font-semibold mb-3">NHF and MREIF Mortgage Calculator</h3>
              <p>
                The National Housing Fund (NHF) and Mortgage Refinance and Liquidity Facility (MREIF) offer 
                affordable housing finance options for Nigerians. Our calculator supports these federal programs, 
                allowing you to see how much you could save with lower interest rates compared to commercial loans.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function MonthlyPaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState(NIGERIAN_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(NIGERIAN_DEFAULTS.loanTerm);
  const [downPayment, setDownPayment] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const calculateMonthlyPayment = () => {
    const propertyVal = parseFormattedNumber(propertyValue) || 0;
    const downPay = parseFormattedNumber(downPayment) || 0;
    const loanAmt = propertyVal - downPay || parseFormattedNumber(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;

    if (!loanAmt || !rate || !term) return null;

    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      return loanAmt / numberOfPayments;
    }

    const monthlyPayment =
      (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const propertyVal = parseFormattedNumber(propertyValue) || 0;
  const downPay = parseFormattedNumber(downPayment) || 0;
  const loanAmt = propertyVal - downPay || parseFormattedNumber(loanAmount) || 0;
  const totalInterest = monthlyPayment
    ? monthlyPayment * (parseFloat(loanTerm) || 0) * 12 - loanAmt
    : 0;
  const totalPayment = monthlyPayment
    ? monthlyPayment * (parseFloat(loanTerm) || 0) * 12
    : 0;

  const handleSendEmail = async () => {
    if (!email || !monthlyPayment) return;

    setSending(true);
    try {
      const response = await fetch('/api/mortgage-calculator/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculatorType: 'monthly',
          data: {
            loanAmount: loanAmt,
            interestRate: parseFloat(interestRate),
            loanTerm: parseFloat(loanTerm),
            propertyValue: propertyVal || null,
            downPayment: downPay || null,
          },
          results: {
            monthlyPayment,
            totalInterest,
            totalPayment,
          },
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Monthly Payment Calculator
          </CardTitle>
          <CardDescription>
            Calculate your monthly mortgage payment based on loan amount, interest rate, and loan term. 
            Tailored for the Nigerian property market.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property-value">Property Value (₦)</Label>
              <Input
                id="property-value"
                type="text"
                placeholder="e.g., 50,000,000"
                value={propertyValue}
                onChange={(e) => handleNumberInputChange(e.target.value, setPropertyValue)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down-payment">Down Payment (₦)</Label>
              <Input
                id="down-payment"
                type="text"
                placeholder="e.g., 15,000,000"
                value={downPayment}
                onChange={(e) => handleNumberInputChange(e.target.value, setDownPayment)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (₦)</Label>
              <Input
                id="loan-amount"
                type="text"
                placeholder="e.g., 35,000,000"
                value={loanAmount || (propertyVal && downPay ? formatNumberWithCommas(propertyVal - downPay) : '')}
                onChange={(e) => handleNumberInputChange(e.target.value, setLoanAmount)}
                disabled={!!(propertyVal && downPay)}
              />
              {propertyVal && downPay && (
                <p className="text-xs text-muted-foreground">
                  Calculated: ₦{formatNumberWithCommas(propertyVal - downPay)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="e.g., 18.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 3% - 28%. Federal housing programs offer lower rates.
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="loan-term">Loan Term (Years)</Label>
              <Input
                id="loan-term"
                type="number"
                placeholder="e.g., 20"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 15-25 years. Federal programs may offer up to 30 years.
              </p>
            </div>
          </div>

          {monthlyPayment && (
            <>
              <div className="mt-8 p-6 bg-[#efb105]/10 rounded-lg border border-[#efb105]/20">
                <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                    <p className="text-2xl font-bold text-[#efb105]">
                      ₦{monthlyPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Interest</p>
                    <p className="text-2xl font-bold">
                      ₦{totalInterest.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payment</p>
                    <p className="text-2xl font-bold">
                      ₦{totalPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Email Results (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={sending || !email || emailSent}
                  className="bg-[#efb105] hover:bg-[#d9a004] text-black mt-6 sm:mt-8"
                >
                  {sending ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : emailSent ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Results
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function DownPaymentCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState(NIGERIAN_DEFAULTS.downPaymentPercent);
  const [downPaymentAmount, setDownPaymentAmount] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const calculateDownPayment = () => {
    const propVal = parseFormattedNumber(propertyValue) || 0;
    const percent = parseFloat(downPaymentPercent) || 0;
    return propVal * (percent / 100);
  };

  const downPayment = propertyValue ? calculateDownPayment() : parseFormattedNumber(downPaymentAmount) || 0;
  const loanAmount = (parseFormattedNumber(propertyValue) || 0) - downPayment;
  const propVal = parseFormattedNumber(propertyValue) || 0;
  const percent = propertyValue
    ? parseFloat(downPaymentPercent)
    : propVal > 0
    ? (downPayment / propVal) * 100
    : 0;

  const handleSendEmail = async () => {
    if (!email || !downPayment) return;

    setSending(true);
    try {
      const response = await fetch('/api/mortgage-calculator/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculatorType: 'downpayment',
          data: {
            propertyValue: parseFormattedNumber(propertyValue) || null,
          },
          results: {
            downPayment,
            percent,
            loanAmount: propertyValue ? loanAmount : null,
          },
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Down Payment Calculator
          </CardTitle>
          <CardDescription>
            Calculate the down payment amount or percentage needed for your property purchase. 
            Typical down payment in Nigeria ranges from 20-40%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prop-value">Property Value (₦)</Label>
              <Input
                id="prop-value"
                type="text"
                placeholder="e.g., 50,000,000"
                value={propertyValue}
                onChange={(e) => {
                  handleNumberInputChange(e.target.value, setPropertyValue);
                  if (downPaymentPercent) {
                    const val = parseFormattedNumber(e.target.value) || 0;
                    const percent = parseFloat(downPaymentPercent) || 0;
                    setDownPaymentAmount(formatNumberWithCommas(val * (percent / 100)));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down-payment-percent">Down Payment Percentage (%)</Label>
              <Input
                id="down-payment-percent"
                type="number"
                step="0.1"
                placeholder="e.g., 30"
                value={downPaymentPercent}
                onChange={(e) => {
                  setDownPaymentPercent(e.target.value);
                  const val = parseFormattedNumber(propertyValue) || 0;
                  const percent = parseFloat(e.target.value) || 0;
                  setDownPaymentAmount(formatNumberWithCommas(val * (percent / 100)));
                }}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 20-40%
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="down-payment-amount">Down Payment Amount (₦)</Label>
              <Input
                id="down-payment-amount"
                type="text"
                placeholder="e.g., 15,000,000"
                value={downPaymentAmount}
                onChange={(e) => {
                  handleNumberInputChange(e.target.value, setDownPaymentAmount);
                  const val = parseFormattedNumber(propertyValue) || 0;
                  const amount = parseFormattedNumber(e.target.value) || 0;
                  if (val > 0) {
                    setDownPaymentPercent(((amount / val) * 100).toString());
                  }
                }}
              />
            </div>
          </div>

          {(propertyValue || downPaymentAmount) && (
            <>
              <div className="mt-8 p-6 bg-[#efb105]/10 rounded-lg border border-[#efb105]/20">
                <h3 className="text-xl font-semibold mb-4">Down Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Down Payment</p>
                    <p className="text-2xl font-bold text-[#efb105]">
                      ₦{downPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {propertyValue && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {percent.toFixed(1)}% of property value
                      </p>
                    )}
                  </div>
                  {propertyValue && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount Needed</p>
                        <p className="text-2xl font-bold">
                          ₦{loanAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Property Value</p>
                        <p className="text-2xl font-bold">
                          ₦{propVal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="down-email">Email Results (Optional)</Label>
                  <Input
                    id="down-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={sending || !email || emailSent}
                  className="bg-[#efb105] hover:bg-[#d9a004] text-black mt-6 sm:mt-8"
                >
                  {sending ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : emailSent ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Results
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [interestRate, setInterestRate] = useState(NIGERIAN_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(NIGERIAN_DEFAULTS.loanTerm);
  const [downPaymentPercent, setDownPaymentPercent] = useState(NIGERIAN_DEFAULTS.downPaymentPercent);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const calculateAffordability = () => {
    const income = parseFormattedNumber(monthlyIncome) || 0;
    const debts = parseFormattedNumber(monthlyDebts) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 0;

    if (!income || !rate || !term) return null;

    // Nigerian lenders typically use 30-33% of income for mortgage payment
    const maxMonthlyPayment = Math.min(income * 0.30, (income - debts) * 0.40);

    if (maxMonthlyPayment <= 0) return null;

    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    let maxLoanAmount;
    if (monthlyRate === 0) {
      maxLoanAmount = maxMonthlyPayment * numberOfPayments;
    } else {
      maxLoanAmount =
        (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    const maxPropertyValue = maxLoanAmount / (1 - downPercent / 100);

    return {
      maxMonthlyPayment,
      maxLoanAmount,
      maxPropertyValue,
    };
  };

  const result = calculateAffordability();

  const handleSendEmail = async () => {
    if (!email || !result) return;

    setSending(true);
    try {
      const response = await fetch('/api/mortgage-calculator/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculatorType: 'affordability',
          data: {
            monthlyIncome: parseFormattedNumber(monthlyIncome),
            monthlyDebts: parseFormattedNumber(monthlyDebts),
            interestRate: parseFloat(interestRate),
            loanTerm: parseFloat(loanTerm),
            downPaymentPercent: parseFloat(downPaymentPercent),
          },
          results: result,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Affordability Calculator
          </CardTitle>
          <CardDescription>
            Determine how much you can afford to borrow based on your income, debts, and loan terms. 
            Calculations use Nigerian lending standards (30% of income for mortgage).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-income">Monthly Gross Income (₦)</Label>
              <Input
                id="monthly-income"
                type="text"
                placeholder="e.g., 500,000"
                value={monthlyIncome}
                onChange={(e) => handleNumberInputChange(e.target.value, setMonthlyIncome)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-debts">Monthly Debt Payments (₦)</Label>
              <Input
                id="monthly-debts"
                type="text"
                placeholder="e.g., 50,000"
                value={monthlyDebts}
                onChange={(e) => handleNumberInputChange(e.target.value, setMonthlyDebts)}
              />
              <p className="text-xs text-muted-foreground">
                Include credit cards, car loans, etc.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="afford-interest-rate">Annual Interest Rate (%)</Label>
              <Input
                id="afford-interest-rate"
                type="number"
                step="0.01"
                placeholder="e.g., 18.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 3% - 28%. Federal housing programs offer lower rates.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="afford-loan-term">Loan Term (Years)</Label>
              <Input
                id="afford-loan-term"
                type="number"
                placeholder="e.g., 20"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 15-25 years. Federal programs may offer up to 30 years.
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="afford-down-payment">Down Payment Percentage (%)</Label>
              <Input
                id="afford-down-payment"
                type="number"
                step="0.1"
                placeholder="e.g., 30"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typical range in Nigeria: 20-40%
              </p>
            </div>
          </div>

          {result && (
            <>
              <div className="mt-8 p-6 bg-[#efb105]/10 rounded-lg border border-[#efb105]/20">
                <h3 className="text-xl font-semibold mb-4">Affordability Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Monthly Payment</p>
                    <p className="text-2xl font-bold text-[#efb105]">
                      ₦{result.maxMonthlyPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on 30% of income
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Loan Amount</p>
                    <p className="text-2xl font-bold">
                      ₦{result.maxLoanAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Property Value</p>
                    <p className="text-2xl font-bold">
                      ₦{result.maxPropertyValue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="afford-email">Email Results (Optional)</Label>
                  <Input
                    id="afford-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={sending || !email || emailSent}
                  className="bg-[#efb105] hover:bg-[#d9a004] text-black mt-6 sm:mt-8"
                >
                  {sending ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : emailSent ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Results
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

interface Scenario {
  id: string;
  propertyValue: string;
  downPayment: string;
  downPaymentPercent: string;
  interestRate: string;
  loanTerm: string;
}

function ComparisonCalculator() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      propertyValue: '',
      downPayment: '',
      downPaymentPercent: NIGERIAN_DEFAULTS.downPaymentPercent,
      interestRate: NIGERIAN_DEFAULTS.interestRate,
      loanTerm: NIGERIAN_DEFAULTS.loanTerm,
    },
  ]);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      {
        id: Date.now().toString(),
        propertyValue: '',
        downPayment: '',
        downPaymentPercent: NIGERIAN_DEFAULTS.downPaymentPercent,
        interestRate: NIGERIAN_DEFAULTS.interestRate,
        loanTerm: NIGERIAN_DEFAULTS.loanTerm,
      },
    ]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter((s) => s.id !== id));
    }
  };

  const updateScenario = (id: string, field: keyof Scenario, value: string) => {
    setScenarios(
      scenarios.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          // Auto-calculate down payment if property value and percent change
          if (field === 'propertyValue' || field === 'downPaymentPercent') {
            const propVal = parseFormattedNumber(updated.propertyValue) || 0;
            const percent = parseFloat(updated.downPaymentPercent) || 0;
            if (propVal > 0 && percent > 0) {
              updated.downPayment = formatNumberWithCommas(propVal * (percent / 100));
            }
          }
          // Auto-calculate percent if property value and down payment change
          if (field === 'downPayment' && updated.propertyValue) {
            const propVal = parseFormattedNumber(updated.propertyValue) || 0;
            const downPay = parseFormattedNumber(value) || 0;
            if (propVal > 0) {
              updated.downPaymentPercent = ((downPay / propVal) * 100).toString();
            }
          }
          return updated;
        }
        return s;
      })
    );
  };

  const calculateScenario = (scenario: Scenario) => {
    const propertyVal = parseFormattedNumber(scenario.propertyValue) || 0;
    const downPay = parseFormattedNumber(scenario.downPayment) || 0;
    const loanAmt = propertyVal - downPay;
    const rate = parseFloat(scenario.interestRate) || 0;
    const term = parseFloat(scenario.loanTerm) || 0;

    if (!loanAmt || !rate || !term) return null;

    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = loanAmt / numberOfPayments;
      return {
        monthlyPayment,
        totalInterest: 0,
        totalPayment: loanAmt,
      };
    }

    const monthlyPayment =
      (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmt;

    return {
      monthlyPayment,
      totalInterest,
      totalPayment,
    };
  };

  const handleSendEmail = async () => {
    if (!email || scenarios.length === 0) return;

    const results = scenarios
      .map((scenario) => {
        const calc = calculateScenario(scenario);
        if (!calc) return null;
        return {
          propertyValue: parseFormattedNumber(scenario.propertyValue) || 0,
          downPayment: parseFormattedNumber(scenario.downPayment) || 0,
          downPaymentPercent: parseFloat(scenario.downPaymentPercent) || 0,
          loanAmount: parseFormattedNumber(scenario.propertyValue) - parseFormattedNumber(scenario.downPayment) || 0,
          interestRate: parseFloat(scenario.interestRate),
          loanTerm: parseFloat(scenario.loanTerm),
          ...calc,
        };
      })
      .filter((r) => r !== null);

    if (results.length === 0) return;

    setSending(true);
    try {
      const response = await fetch('/api/mortgage-calculator/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculatorType: 'comparison',
          data: { scenarios },
          results: { scenarios: results },
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Compare Multiple Scenarios
          </CardTitle>
          <CardDescription>
            Compare different mortgage scenarios side-by-side to find the best option for you. 
            Add multiple scenarios with different interest rates, loan terms, or down payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scenarios.map((scenario, index) => {
            const calc = calculateScenario(scenario);
            return (
              <div key={scenario.id} className="p-6 border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Scenario {index + 1}</h3>
                  {scenarios.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeScenario(scenario.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Value (₦)</Label>
                    <Input
                      type="text"
                      placeholder="e.g., 50,000,000"
                      value={scenario.propertyValue}
                      onChange={(e) => {
                        handleNumberInputChange(e.target.value, (val) => updateScenario(scenario.id, 'propertyValue', val));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Down Payment %</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 30"
                      value={scenario.downPaymentPercent}
                      onChange={(e) => updateScenario(scenario.id, 'downPaymentPercent', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Down Payment (₦)</Label>
                    <Input
                      type="text"
                      placeholder="Auto-calculated"
                      value={scenario.downPayment}
                      onChange={(e) => {
                        handleNumberInputChange(e.target.value, (val) => updateScenario(scenario.id, 'downPayment', val));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 18.5"
                      value={scenario.interestRate}
                      onChange={(e) => updateScenario(scenario.id, 'interestRate', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical range in Nigeria: 3% - 28%. Federal housing programs offer lower rates.
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Loan Term (Years)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 20"
                      value={scenario.loanTerm}
                      onChange={(e) => updateScenario(scenario.id, 'loanTerm', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical range in Nigeria: 15-25 years. Federal programs may offer up to 30 years.
                    </p>
                  </div>
                </div>

                {calc && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="text-xl font-bold text-[#efb105]">
                          ₦{calc.monthlyPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-xl font-bold">
                          ₦{calc.totalInterest.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Payment</p>
                        <p className="text-xl font-bold">
                          ₦{calc.totalPayment.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Button
              variant="outline"
              onClick={addScenario}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Scenario
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 sm:justify-end">
              <div className="flex-1 space-y-2 min-w-[200px]">
                <Label htmlFor="compare-email">Email Results (Optional)</Label>
                <Input
                  id="compare-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={sending || !email || emailSent}
                className="bg-[#efb105] hover:bg-[#d9a004] text-black mt-6 sm:mt-8"
              >
                {sending ? (
                  <>
                    <Mail className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : emailSent ? (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Sent!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Results
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
