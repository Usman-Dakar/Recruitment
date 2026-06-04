import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SlidePanelProps {
  title: string;
  onClose: () => void;
  width?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
}

const WIDTH_CLASSES = { sm: 'w-72', md: 'w-80', lg: 'w-96' };

export function SlidePanel({
  title,
  onClose,
  width = 'md',
  children,
  headerContent,
  className,
}: SlidePanelProps) {
  return (
    <div className={cn('shrink-0 flex flex-col border-l border-border bg-white overflow-hidden', WIDTH_CLASSES[width], className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold truncate">{title}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose} aria-label="Close panel">
          <X className="h-4 w-4" />
        </Button>
      </div>
      {headerContent && (
        <div className="border-b border-border">
          {headerContent}
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
