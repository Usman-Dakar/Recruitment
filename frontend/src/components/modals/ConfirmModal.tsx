import ModalShell from './ModalShell'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title = 'Confirm',
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      title={title}
      labelId="confirm-modal-title"
      maxWidth="max-w-md"
      headerClass="bg-surface-700/50 rounded-t-xl"
      onClose={onCancel}
    >
      <div className="px-5 py-5">
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>
      <div className="px-5 py-3 border-t border-white/5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 rounded-lg hover:border-white/20 hover:text-white transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  )
}
