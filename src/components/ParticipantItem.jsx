import { Edit2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button.jsx'

import RoleIcon from './RoleIcon.jsx'
import SkillLevelIcon from './SkillLevelIcon.jsx'

const ParticipantItem = ({ 
  participant, 
  onEdit,
  onRemove
}) => {

  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <SkillLevelIcon weight={participant.weight} size={16} />
        <RoleIcon role={participant.role} size={16} />
        <span className="text-white">{participant.name}</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onEdit}
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

