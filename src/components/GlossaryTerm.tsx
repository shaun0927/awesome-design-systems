import React, { useState } from 'react';

interface GlossaryTermProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function GlossaryTerm({ term, definition, children }: GlossaryTermProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="glossary-term"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="glossary-term__text">{children}</span>
      {isHovered && (
        <span className="glossary-term__tooltip">
          <strong>{term}</strong>: {definition}
        </span>
      )}
    </span>
  );
}
