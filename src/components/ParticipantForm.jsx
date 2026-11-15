import { Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AlertDialogTrigger } from '@/components/ui/alert-dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'

const ParticipantForm = ({ 
  newName, 
  onNameChange, 
  onAdd, 
  onClearStart,
  participantsCount 
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 mb-4 tour-participant-form">
      <Input
        type="text"
        placeholder={t('participants.placeholder')}
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        className="bg-[var(--color-card-secondary)] border-input text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
      />
      <Button
        onClick={onAdd}
        variant="secondary" aria-label={t('participants.add')} className="min-h-11 min-w-11"
      >
        <span className="block sm:hidden text-xl">+</span>
        <span className="hidden sm:block">{t('participants.add')}</span>
      </Button>
      <AlertDialogTrigger asChild>
        <Button
          onClick={onClearStart}
          variant="ghost"
          className="min-h-11 min-w-11 text-muted-foreground" aria-label={t('participants.clear_all')}
          disabled={participantsCount === 0}
        >
          <Trash className="w-4 h-4" />
          <span className="hidden md:inline ms-2">
            {t('participants.clear_all')}
          </span>
        </Button>
      </AlertDialogTrigger>
    </div>
  )
}

export default ParticipantForm

