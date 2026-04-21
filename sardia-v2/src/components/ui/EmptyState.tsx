import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      dir="rtl"
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {Icon && (
        <div className="mb-6 w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
          <Icon size={28} strokeWidth={1.5} className="text-stone-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="font-serif text-2xl md:text-3xl text-primary mb-3">{title}</h3>
      {description && (
        <p className="font-sans text-text-muted max-w-md leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
