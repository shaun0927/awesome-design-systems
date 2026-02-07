import React from 'react';

interface AudienceBadgeProps {
  audience: 'developer' | 'designer' | 'both' | 'leadership';
}

export default function AudienceBadge({ audience }: AudienceBadgeProps) {
  const config = {
    developer: { label: 'For Developers', icon: '💻', className: 'developer' },
    designer: { label: 'For Designers', icon: '🎨', className: 'designer' },
    both: { label: 'For Developers & Designers', icon: '🤝', className: 'both' },
    leadership: { label: 'For Leadership', icon: '📊', className: 'leadership' },
  };

  const { label, icon, className } = config[audience];

  return (
    <div className={`audience-badge audience-badge--${className}`}>
      <span className="audience-badge__icon">{icon}</span>
      <span className="audience-badge__label">{label}</span>
    </div>
  );
}
