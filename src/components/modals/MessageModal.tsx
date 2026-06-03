import ModalShell from './ModalShell'

interface MessageModalProps {
  isOpen: boolean
  title?: string
  message: string
  onClose: () => void
}

export default function MessageModal({
  isOpen,
  title = 'Message',
  message,
  onClose,
}: MessageModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      title={title}
      labelId="msg-modal-title"
      maxWidth="max-w-sm"
      panelClass="glow-brand"
      onClose={onClose}
    >
      <div className="px-5 py-4">
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>
      <div className="px-5 py-3 border-t border-white/5 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors"
        >
          OK
        </button>
      </div>
    </ModalShell>
  )
}
