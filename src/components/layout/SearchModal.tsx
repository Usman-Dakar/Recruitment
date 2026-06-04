import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Loader2, Search, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCandidates } from '@/features/candidates';
import { useJobs } from '@/features/jobs';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 250);

  const { data: candidatesData, isLoading: loadingCandidates } = useCandidates(
    { search: debouncedQuery, perPage: 5 },
    { enabled: debouncedQuery.length > 1 },
  );
  const { data: jobsData, isLoading: loadingJobs } = useJobs(
    { search: debouncedQuery, perPage: 5 },
    { enabled: debouncedQuery.length > 1 },
  );

  const candidates = candidatesData?.data ?? [];
  const jobs = jobsData?.data ?? [];
  const isLoading = loadingCandidates || loadingJobs;
  const hasResults = candidates.length > 0 || jobs.length > 0;
  const showEmpty = debouncedQuery.length > 1 && !isLoading && !hasResults;

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function go(path: string) {
    navigate(path);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden" aria-describedby={undefined}>
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search candidates, jobs…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {/* Idle hint */}
          {debouncedQuery.length <= 1 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Type to search across candidates and jobs
            </p>
          )}

          {showEmpty && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
          )}

          {candidates.length > 0 && (
            <section>
              <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Candidates
              </p>
              {candidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => go(`/candidates/${c.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.position}</p>
                  </div>
                </button>
              ))}
            </section>
          )}

          {jobs.length > 0 && (
            <section>
              <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Jobs
              </p>
              {jobs.map(j => (
                <button
                  key={j.id}
                  onClick={() => go(`/jobs/${j.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100">
                    <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{j.department} · {j.location}</p>
                  </div>
                </button>
              ))}
            </section>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">ESC</kbd>
            {' '}to close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
