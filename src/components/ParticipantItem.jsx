import { Edit2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button.jsx'

import PlayerDisplay from './PlayerDisplay.jsx'

export default function ParticipantItem({ participant, onEdit, onRemove, onInlineNameUpdate }) {
  const { t } = useTranslation()
  return <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-1">
    <PlayerDisplay participant={participant} onInlineNameUpdate={onInlineNameUpdate} className="flex-1" />
    <div className="flex shrink-0">
      <Button onClick={onEdit} size="icon" variant="ghost" className="min-h-11 min-w-11 text-muted-foreground" aria-label={`${t('participants.edit')}: ${participant.name}`}><Edit2 className="size-4" /></Button>
      <Button onClick={onRemove} size="icon" variant="ghost" className="min-h-11 min-w-11 text-muted-foreground" aria-label={`${t('participants.remove')}: ${participant.name}`}><Trash2 className="size-4" /></Button>
    </div>
  </div>
}
