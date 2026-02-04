// SEO Tools Utility

export interface SEOAnalysis {
  score: number;
  title: {
    value: string;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  description: {
    value: string;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  keywords: {
    found: string[];
    suggested: string[];
  };
  headings: {
    h1: number;
    h2: number;
    h3: number;
    optimal: boolean;
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
}

// Analyze content for SEO
export function analyzeSEO(content: {
  title?: string;
  description?: string;
  content?: string;
  keywords?: string[];
}): SEOAnalysis {
  const title = content.title || '';
  const description = content.description || '';
  const htmlContent = content.content || '';
  const keywords = content.keywords || [];

  // Extract text from HTML
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Count headings
  const h1Matches = htmlContent.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
  const h2Matches = htmlContent.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
  const h3Matches = htmlContent.match(/<h3[^>]*>.*?<\/h3>/gi) || [];

  // Count images
  const imageMatches = htmlContent.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = imageMatches.filter((img) => /alt=["'][^"']*["']/i.test(img)).length;

  // Count links
  const linkMatches = htmlContent.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  const internalLinks = linkMatches.filter((link) => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) return false;
    const href = hrefMatch[1];
    // Internal links start with / or are relative
    return href.startsWith('/') || (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:'));
  }).length;

  // Check for keywords in content
  const foundKeywords = keywords.filter((keyword) =>
    textContent.toLowerCase().includes(keyword.toLowerCase())
  );

  // Generate suggestions
  const titleSuggestions: string[] = [];
  if (title.length < 30) titleSuggestions.push('Title is too short (aim for 30-60 characters)');
  if (title.length > 60) titleSuggestions.push('Title is too long (aim for 30-60 characters)');
  if (!title) titleSuggestions.push('Add a title');

  const descriptionSuggestions: string[] = [];
  if (description.length < 120) descriptionSuggestions.push('Description is too short (aim for 120-160 characters)');
  if (description.length > 160) descriptionSuggestions.push('Description is too long (aim for 120-160 characters)');
  if (!description) descriptionSuggestions.push('Add a meta description');

  // Calculate score
  let score = 100;
  if (title.length < 30 || title.length > 60) score -= 10;
  if (!title) score -= 20;
  if (description.length < 120 || description.length > 160) score -= 10;
  if (!description) score -= 20;
  if (h1Matches.length !== 1) score -= 10;
  if (imagesWithAlt < imageMatches.length) score -= 10;
  if (foundKeywords.length < keywords.length * 0.5) score -= 10;
  if (textContent.length < 300) score -= 10;

  return {
    score: Math.max(0, score),
    title: {
      value: title,
      length: title.length,
      optimal: title.length >= 30 && title.length <= 60,
      suggestions: titleSuggestions,
    },
    description: {
      value: description,
      length: description.length,
      optimal: description.length >= 120 && description.length <= 160,
      suggestions: descriptionSuggestions,
    },
    keywords: {
      found: foundKeywords,
      suggested: generateKeywordSuggestions(textContent, keywords),
    },
    headings: {
      h1: h1Matches.length,
      h2: h2Matches.length,
      h3: h3Matches.length,
      optimal: h1Matches.length === 1,
    },
    images: {
      total: imageMatches.length,
      withAlt: imagesWithAlt,
      withoutAlt: imageMatches.length - imagesWithAlt,
    },
    links: {
      internal: internalLinks,
      external: linkMatches.length - internalLinks,
    },
  };
}

// Generate keyword suggestions
function generateKeywordSuggestions(content: string, existingKeywords: string[]): string[] {
  // Simple keyword extraction (in production, use a proper NLP library)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const suggestions = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
    .filter((word) => !existingKeywords.includes(word));

  return suggestions;
}

// Generate meta description from content
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Generate title suggestions
export function generateTitleSuggestions(content: string): string[] {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  
  const suggestions: string[] = [];
  
  // Generate suggestions from sentences
  for (const sentence of sentences.slice(0, 5)) {
    const words = sentence.trim().split(/\s+/);
    const sentenceText = sentence.trim();
    
    // If sentence is already optimal length (30-60 chars), use it as-is
    if (sentenceText.length >= 30 && sentenceText.length <= 60) {
      suggestions.push(sentenceText);
      continue;
    }
    
    // If sentence is too short, try to combine with next sentence
    if (sentenceText.length < 30 && words.length > 0) {
      // Try to create a title by taking key words
      const importantWords = words.filter(w => 
        w.length > 4 && 
        !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(w.toLowerCase())
      );
      
      if (importantWords.length >= 3) {
        let title = importantWords.slice(0, 8).join(' ');
        if (title.length < 30) {
          title = words.slice(0, Math.min(12, words.length)).join(' ');
        }
        if (title.length >= 30 && title.length <= 60) {
          suggestions.push(title);
        }
      }
      continue;
    }
    
    // If sentence is too long, create a concise version
    if (sentenceText.length > 60) {
      // Try to create a title by taking first part up to 60 chars
      let title = '';
      for (let i = 0; i < words.length; i++) {
        const testTitle = title ? `${title} ${words[i]}` : words[i];
        if (testTitle.length <= 60) {
          title = testTitle;
        } else {
          break;
        }
      }
      if (title.length >= 30) {
        suggestions.push(title);
      }
    }
  }
  
  // Remove duplicates and return up to 3 suggestions
  const unique = Array.from(new Set(suggestions));
  return unique.slice(0, 3).filter((title) => title.length >= 30 && title.length <= 60);
}

