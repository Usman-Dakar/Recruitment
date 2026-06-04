import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageSquare, Pencil, Send, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAddReply, useDeleteNote, useUpdateNote } from '../hooks/useNoteMutations';
import type { CandidateNote } from '../types/note.types';

interface NoteCardProps {
  note: CandidateNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { mutate: updateNote, isPending: saving } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: addReply, isPending: replying } = useAddReply();

  const handleSave = () => {
    if (!editContent.trim()) return;
    updateNote({ id: note.id, content: editContent.trim() }, {
      onSuccess: () => { setEditing(false); toast.success('Note updated'); },
      onError: () => toast.error('Failed to update note'),
    });
  };

  const handleDelete = () => {
    deleteNote(note.id, { onError: () => toast.error('Failed to delete note') });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    addReply({ noteId: note.id, content: replyText.trim() }, {
      onSuccess: () => setReplyText(''),
      onError: () => toast.error('Failed to add reply'),
    });
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{note.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-xs font-semibold text-foreground">{note.authorName}</span>
            <span className="mx-1.5 text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(note.createdAt, { addSuffix: true })}
            </span>
            {note.updatedAt && (
              <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(`/candidates/${note.candidateId}`)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        >
          {note.candidateName}
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditContent(note.content); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground">{note.content}</p>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowReplies(v => !v)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {note.replies.length > 0 ? `${note.replies.length} ${note.replies.length === 1 ? 'reply' : 'replies'}` : 'Reply'}
          </button>
          {note.isOwn && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Edit note"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                aria-label="Delete note"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Replies */}
      {showReplies && (
        <div className="ml-4 space-y-3 border-l-2 border-border pl-4">
          {note.replies.map(reply => (
            <div key={reply.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">{reply.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground">{reply.content}</p>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Write a reply…"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReply()}
            />
            <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleReply} disabled={replying}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
