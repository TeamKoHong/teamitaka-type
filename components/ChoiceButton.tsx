'use client';

interface ChoiceButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function ChoiceButton({ 
  children, 
  selected, 
  onClick, 
  disabled = false,
  variant = 'primary',
  className = '' 
}: ChoiceButtonProps) {
  
  const baseClasses = `
    choice-button
    ${selected ? 'selected' : 'unselected'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      type="button"
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}