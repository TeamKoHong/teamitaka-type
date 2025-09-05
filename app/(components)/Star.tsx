import { CSSProperties } from 'react';

export default function Star({ 
  className = '', 
  style 
}: { 
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg 
      className={className}
      style={style}
      viewBox="0 0 24 24" 
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 2l1.6 4.7L18 8.2l-4.4 2 .8 4.8-3.9-2.5-3.9 2.5.8-4.8L6 8.2l4.4-1.5L12 2z" />
    </svg>
  );
}