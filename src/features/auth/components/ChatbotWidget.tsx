import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between rounded-t-xl bg-primary px-4 py-3">
            <span className="text-sm font-semibold text-primary-foreground">Need help?</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-sm text-muted-foreground">How can we assist you today?</p>
            <div className="space-y-2">
              {[
                'I forgot my password',
                'I need to request access',
                'I have a login issue',
              ].map(option => (
                <button
                  key={option}
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        size="icon"
        onClick={() => setOpen(v => !v)}
        aria-label="Open help chat"
        className={cn(
          'h-12 w-12 rounded-full shadow-lg',
          open && 'bg-muted text-foreground hover:bg-muted',
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  );
}
