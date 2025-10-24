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
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder={t('participants.placeholder')}
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      />
      <Button
        onClick={onAdd}
        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
      >
        <span className="block sm:hidden text-xl">+</span>
        <span className="hidden sm:block">{t('participants.add')}</span>
      </Button>
      <AlertDialogTrigger asChild>
        <Button
          onClick={onClearStart}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
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

