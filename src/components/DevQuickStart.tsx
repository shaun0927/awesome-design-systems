import React from 'react';

interface DevQuickStartProps {
  what: string;      // "What this means for you"
  learn: string;     // "You'll learn"
  able: string;      // "You'll be able to"
}

export default function DevQuickStart({ what, learn, able }: DevQuickStartProps) {
  return (
    <div className="dev-quickstart">
      <div className="dev-quickstart__header">Developer Quick Start</div>
      <ul className="dev-quickstart__list">
        <li><strong>What this means for you</strong>: {what}</li>
        <li><strong>You'll learn</strong>: {learn}</li>
        <li><strong>You'll be able to</strong>: {able}</li>
      </ul>
    </div>
  );
}
