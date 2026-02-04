/**
 * A/B Testing Capability
 * Test different layouts, CTA buttons, and content variations
 */

export type TestVariant = 'A' | 'B' | 'C';

export interface ABTest {
  id: string;
  name: string;
  variants: TestVariant[];
  active: boolean;
}

export interface TestResult {
  testId: string;
  variant: TestVariant;
  views: number;
  clicks: number;
  conversions: number;
}

const STORAGE_KEYS = {
  TESTS: 'mdh_ab_tests',
  RESULTS: 'mdh_ab_results',
  ASSIGNMENTS: 'mdh_ab_assignments',
} as const;

/**
 * Get or assign a variant for a test
 */
export function getVariant(testId: string, variants: TestVariant[] = ['A', 'B']): TestVariant {
  if (typeof window === 'undefined') return 'A';

  try {
    const assignments = getAssignments();
    const existing = assignments[testId];
    
    if (existing && variants.includes(existing)) {
      return existing;
    }

    // Assign a random variant
    const variant = variants[Math.floor(Math.random() * variants.length)];
    assignments[testId] = variant;
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    
    return variant;
  } catch (error) {
    console.error('Error getting variant:', error);
    return 'A';
  }
}

/**
 * Track a view for a test variant
 */
export function trackView(testId: string, variant: TestVariant): void {
  if (typeof window === 'undefined') return;

  try {
    const results = getResults();
    const key = `${testId}_${variant}`;
    
    if (!results[key]) {
      results[key] = {
        testId,
        variant,
        views: 0,
        clicks: 0,
        conversions: 0,
      };
    }
    
    results[key].views += 1;
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

/**
 * Track a click for a test variant
 */
export function trackClick(testId: string, variant: TestVariant): void {
  if (typeof window === 'undefined') return;

  try {
    const results = getResults();
    const key = `${testId}_${variant}`;
    
    if (!results[key]) {
      results[key] = {
        testId,
        variant,
        views: 0,
        clicks: 0,
        conversions: 0,
      };
    }
    
    results[key].clicks += 1;
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

/**
 * Track a conversion for a test variant
 */
export function trackConversion(testId: string, variant: TestVariant): void {
  if (typeof window === 'undefined') return;

  try {
    const results = getResults();
    const key = `${testId}_${variant}`;
    
    if (!results[key]) {
      results[key] = {
        testId,
        variant,
        views: 0,
        clicks: 0,
        conversions: 0,
      };
    }
    
    results[key].conversions += 1;
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}

/**
 * Get test results
 */
export function getResults(): Record<string, TestResult> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get user assignments
 */
export function getAssignments(): Record<string, TestVariant> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get conversion rate for a variant
 */
export function getConversionRate(testId: string, variant: TestVariant): number {
  const results = getResults();
  const key = `${testId}_${variant}`;
  const result = results[key];
  
  if (!result || result.views === 0) return 0;
  return (result.conversions / result.views) * 100;
}

/**
 * Get click-through rate for a variant
 */
export function getClickThroughRate(testId: string, variant: TestVariant): number {
  const results = getResults();
  const key = `${testId}_${variant}`;
  const result = results[key];
  
  if (!result || result.views === 0) return 0;
  return (result.clicks / result.views) * 100;
}

