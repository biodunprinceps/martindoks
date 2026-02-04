'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analyzeSEO, generateMetaDescription, generateTitleSuggestions } from '@/lib/seo-tools';
import { Search, CheckCircle, XCircle, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';

interface SEOToolsProps {
  content: {
    title?: string;
    description?: string;
    content?: string;
    keywords?: string[];
  };
  onUpdate?: (updates: { title?: string; description?: string }) => void;
}

export function SEOTools({ content, onUpdate }: SEOToolsProps) {
  const [analysis, setAnalysis] = useState(() => analyzeSEO(content));
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = () => {
    const newAnalysis = analyzeSEO(content);
    setAnalysis(newAnalysis);
    
    if (content.content) {
      const suggestions = generateTitleSuggestions(content.content);
      setTitleSuggestions(suggestions);
    }
  };

  const handleGenerateDescription = () => {
    if (content.content && onUpdate) {
      const description = generateMetaDescription(content.content);
      onUpdate({ description });
      handleAnalyze();
    }
  };

  const handleCopyToClipboard = async (text: string, index: number) => {
    // Ensure we're copying the full text without any truncation
    const fullText = text.trim();
    
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
      
      // Log for debugging (can be removed in production)
      console.log('Copied to clipboard:', fullText);
      console.log('Text length:', fullText.length);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopiedIndex(index);
          setTimeout(() => {
            setCopiedIndex(null);
          }, 2000);
          console.log('Copied to clipboard (fallback):', fullText);
          console.log('Text length:', fullText.length);
        } else {
          alert('Failed to copy to clipboard');
        }
      } catch (err) {
        alert('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            SEO Analysis
          </CardTitle>
          <Button type="button" onClick={handleAnalyze} size="sm" className="w-full sm:w-auto">
            Analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* SEO Score */}
        <div className="text-center p-4 sm:p-6 bg-muted rounded-lg">
          <div className={`text-3xl sm:text-4xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
            {analysis.score}/100
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">SEO Score</p>
        </div>

        {/* Title Analysis */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm sm:text-base">Title</h3>
            {analysis.title.optimal ? (
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            Length: {analysis.title.length} characters (optimal: 30-60)
          </p>
          {analysis.title.suggestions.length > 0 && (
            <div className="space-y-1">
              {analysis.title.suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {titleSuggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">Title Suggestions (click to copy):</p>
              {titleSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleCopyToClipboard(suggestion, index)}
                  className="w-full border border-[#efb105] bg-transparent hover:bg-[#efb105]/10 rounded-md px-3 py-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#efb105] group-hover:text-[#d9a004]" />
                    <span className="flex-1 text-sm break-words whitespace-normal text-foreground leading-relaxed">
                      {suggestion}
                    </span>
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-[#efb105] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  {copiedIndex === index && (
                    <p className="text-xs text-green-600 mt-1 ml-6">Copied to clipboard!</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description Analysis */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Meta Description</h3>
            {analysis.description.optimal ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Length: {analysis.description.length} characters (optimal: 120-160)
          </p>
          {analysis.description.suggestions.length > 0 && (
            <div className="space-y-1">
              {analysis.description.suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {content.content && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateDescription}
              className="mt-2"
            >
              Generate Description
            </Button>
          )}
        </div>

        {/* Keywords */}
        <div>
          <h3 className="font-semibold mb-2">Keywords</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Found in content:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.found.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            {analysis.keywords.suggested.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Suggested keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.suggested.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headings */}
        <div>
          <h3 className="font-semibold mb-2">Headings</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">H1</p>
              <p className="font-semibold">{analysis.headings.h1}</p>
            </div>
            <div>
              <p className="text-muted-foreground">H2</p>
              <p className="font-semibold">{analysis.headings.h2}</p>
            </div>
            <div>
              <p className="text-muted-foreground">H3</p>
              <p className="font-semibold">{analysis.headings.h3}</p>
            </div>
          </div>
          {!analysis.headings.optimal && (
            <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
              <AlertCircle className="h-3 w-3" />
              Should have exactly 1 H1 heading
            </p>
          )}
        </div>

        {/* Images */}
        <div>
          <h3 className="font-semibold mb-2">Images</h3>
          <div className="text-sm space-y-1">
            <p>Total: {analysis.images.total}</p>
            <p className="text-green-600">
              With alt text: {analysis.images.withAlt}
            </p>
            {analysis.images.withoutAlt > 0 && (
              <p className="text-red-600">
                Without alt text: {analysis.images.withoutAlt}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

