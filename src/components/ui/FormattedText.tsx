'use client';

import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * Component that renders formatted text with support for:
 * - Line breaks (double line break = new paragraph)
 * - Bullet lists (lines starting with - or *)
 * - Numbered lists (lines starting with 1. 2. etc)
 * - Bold text (**text** or __text__)
 * - Italic text (*text* or _text_)
 * - Headings (# Heading, ## Subheading, etc)
 */
export function FormattedText({ content, className = '' }: FormattedTextProps) {
  if (!content) return null;

  // Split content into lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const formatInlineText = (text: string, baseKey: string = ''): React.ReactNode => {
    if (!text) return null;

    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    // Process in order: bold first, then italic
    while (remaining.length > 0) {
      // Look for bold markers: **text** or __text__
      const boldMatch = remaining.match(/(\*\*|__)(.+?)\1/);
      
      // Look for italic markers: *text* or _text_ (but not part of bold)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)|(?<!_)_(?!_)([^_\n]+?)_(?!_)/);

      let match: RegExpMatchArray | null = null;
      let matchType: 'bold' | 'italic' | null = null;
      let matchStart = -1;

      // Determine which match comes first
      if (boldMatch && italicMatch) {
        if (boldMatch.index! < italicMatch.index!) {
          match = boldMatch;
          matchType = 'bold';
          matchStart = boldMatch.index!;
        } else {
          match = italicMatch;
          matchType = 'italic';
          matchStart = italicMatch.index!;
        }
      } else if (boldMatch) {
        match = boldMatch;
        matchType = 'bold';
        matchStart = boldMatch.index!;
      } else if (italicMatch) {
        match = italicMatch;
        matchType = 'italic';
        matchStart = italicMatch.index!;
      }

      if (match && matchType) {
        // Add text before the match (plain text, no key needed)
        if (matchStart > 0) {
          const beforeText = remaining.substring(0, matchStart);
          if (beforeText) {
            parts.push(beforeText);
          }
        }

        // Add the formatted content (React element, needs key)
        const content = matchType === 'bold' ? match[2] : (match[1] || match[2]);
        if (matchType === 'bold') {
          parts.push(
            <strong key={`${baseKey}-fmt-${keyCounter++}`} className="font-semibold">
              {content}
            </strong>
          );
        } else {
          parts.push(
            <em key={`${baseKey}-fmt-${keyCounter++}`} className="italic">
              {content}
            </em>
          );
        }

        // Continue with remaining text
        remaining = remaining.substring(matchStart + match[0].length);
      } else {
        // No more formatting, add remaining text (plain text, no key needed)
        if (remaining) {
          parts.push(remaining);
        }
        break;
      }
    }

    // If no formatting found, return plain text
    if (parts.length === 0) {
      return text;
    }

    // Return fragment with keyed children
    return <React.Fragment key={baseKey}>{parts}</React.Fragment>;
  };

  const processParagraph = (paragraph: string[], index: number) => {
    if (paragraph.length === 0) return null;
    
    const text = paragraph.join(' ').trim();
    if (!text) return null;

    return <p key={`para-${index}`} className="mb-4">{formatInlineText(text, `para-${index}`)}</p>;
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside mb-4 space-y-2 ml-4">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-muted-foreground">
                {formatInlineText(item.trim(), `ul-${elements.length}-${idx}`)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={elements.length} className="list-decimal list-inside mb-4 space-y-2 ml-4">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-muted-foreground">
                {formatInlineText(item.trim(), `ol-${elements.length}-${idx}`)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const para = processParagraph(currentParagraph, elements.length);
      if (para) {
        elements.push(para);
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Empty line - flush current list or paragraph
    if (line === '') {
      flushList();
      flushParagraph();
      continue;
    }

    // Check for headings
    if (line.startsWith('#')) {
      flushList();
      flushParagraph();
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      const headingLevel = Math.min(level, 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const HeadingTag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const HeadingComponent = HeadingTag as keyof React.JSX.IntrinsicElements;
      elements.push(
        React.createElement(
          HeadingComponent,
          {
            key: elements.length,
            className: `${level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'} font-bold mb-4 mt-6`
          },
          text
        )
      );
      continue;
    }

    // Check for bullet list
    if (line.match(/^[-*]\s+/)) {
      flushParagraph();
      const item = line.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(item);
      continue;
    }

    // Check for numbered list
    if (line.match(/^\d+\.\s+/)) {
      flushParagraph();
      const item = line.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(item);
      continue;
    }

    // Regular text line
    flushList();
    currentParagraph.push(line);
  }

  // Flush any remaining content
  flushList();
  flushParagraph();

  return (
    <div className={`formatted-text ${className}`}>
      {elements.length > 0 ? elements : <p className="text-muted-foreground">{content}</p>}
    </div>
  );
}
