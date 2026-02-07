import React from 'react';

interface BeforeAfterProps {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: BeforeAfterProps) {
  return (
    <div className="before-after">
      <div className="before-after__column before-after__column--before">
        <div className="before-after__header before-after__header--before">
          {beforeLabel}
        </div>
        <div className="before-after__content">{before}</div>
      </div>
      <div className="before-after__column before-after__column--after">
        <div className="before-after__header before-after__header--after">
          {afterLabel}
        </div>
        <div className="before-after__content">{after}</div>
      </div>
    </div>
  );
}
