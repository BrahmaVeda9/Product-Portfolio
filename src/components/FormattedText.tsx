import React from 'react';

const SPLIT_BOLD = /(\*\*[\s\S]*?\*\*|__[\s\S]*?__|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>)/i;
const IS_BOLD = /^(\*\*[\s\S]*?\*\*|__[\s\S]*?__|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>)$/i;

const SPLIT_ITALIC = /(\*[\s\S]*?\*|_[\s\S]*?_|<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>)/i;
const IS_ITALIC = /^(\*[\s\S]*?\*|_[\s\S]*?_|<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>)$/i;

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className }: FormattedTextProps) {
  if (!text) return null;

  const parts = text.split(SPLIT_BOLD);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        if (IS_BOLD.test(part)) {
          const content = part
            .replace(/^(\*\*|__|<b>|<strong>)/i, '')
            .replace(/(\*\*|__|<\/b>|<\/strong>)$/i, '');
          return (
            <strong key={index} className="font-bold text-navy-900">
              {content}
            </strong>
          );
        }

        if (part.includes('*') || part.includes('_') || part.includes('<i') || part.includes('<em')) {
          const subParts = part.split(SPLIT_ITALIC);
          return (
            <React.Fragment key={index}>
              {subParts.map((sub, sIdx) => {
                if (!sub) return null;
                if (IS_ITALIC.test(sub)) {
                  const content = sub
                    .replace(/^(\*|_|<i>|<em>)/i, '')
                    .replace(/(\*|_|<\/i>|<\/em>)$/i, '');
                  return (
                    <em key={sIdx} className="italic text-navy-800">
                      {content}
                    </em>
                  );
                }
                return sub;
              })}
            </React.Fragment>
          );
        }

        return part;
      })}
    </span>
  );
}
