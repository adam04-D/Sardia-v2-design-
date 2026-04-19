import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import { RevealText } from '../RevealText';

type Props = {
  title: string;
  viewAllTo?: string;
  viewAllLabel?: string;
  className?: string;
};

export function SectionHeading({ title, viewAllTo, viewAllLabel = 'مشاهدة الكل', className = '' }: Props) {
  return (
    <div className={`flex justify-between items-end border-b border-accent/10 pb-6 ${className}`}>
      <RevealText text={title} className="font-serif text-4xl font-bold text-text-main" />
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="font-sans text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-2 group"
        >
          {viewAllLabel}
          <ArrowUpLeft size={16} aria-hidden="true" className="group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
