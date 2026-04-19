import type { ReactNode } from 'react';

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-accent ${className}`}>
      {children}
    </p>
  );
}
