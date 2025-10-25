import { Edit2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'

const ParticipantItem = ({ 
  participant, 
  isEditing, 
  editedName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onRemove
}) => {
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
        <div className="flex gap-2 flex-1">
          <Input
            type="text"
            value={editedName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
            className="bg-gray-600 border-gray-500 text-white"
          />
          <Button
            onClick={onSaveEdit}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {t('participants.save')}
          </Button>
          <Button
            onClick={onCancelEdit}
            size="sm"
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-600"
          >
            {t('participants.cancel')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
      <span className="text-white">{participant.name}</span>
      <div className="flex gap-2">
        <Button
          onClick={onStartEdit}
          size="sm"
          variant="outline"
          className="border-gray-500 text-gray-300 hover:bg-gray-600"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRemove}
          size="sm"
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default ParticipantItem

