import { Edit2, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'

import RoleIcon from './RoleIcon.jsx'
import SkillLevelIcon from './SkillLevelIcon.jsx'

const ParticipantItem = ({ 
  participant, 
  onEdit,
  onRemove,
  onInlineNameUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState(participant.name)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Sync editingName with participant.name when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditingName(participant.name)
    }
  }, [participant.name, isEditing])

  const handleNameClick = () => {
    if (onInlineNameUpdate) {
      setIsEditing(true)
      setEditingName(participant.name)
    }
  }

  const handleSave = () => {
    if (onInlineNameUpdate) {
      const success = onInlineNameUpdate(participant.id, editingName)
      if (success) {
        setIsEditing(false)
      } else {
        // Validation failed, refocus the input so user can fix it
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
          }
        }, 0)
      }
      // If validation fails, keep editing mode and keep the text they typed so they can fix it
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingName(participant.name)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleBlur = () => {
    // On blur, try to save. If validation fails, input will be refocused in handleSave
    handleSave()
  }

  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
      <div 
        className={`flex items-center gap-2 flex-1 ${onInlineNameUpdate && !isEditing ? 'cursor-pointer' : ''}`}
        onClick={onInlineNameUpdate && !isEditing ? handleNameClick : undefined}
      >
        <SkillLevelIcon weight={participant.weight} size={16} />
        <RoleIcon role={participant.role} size={16} />
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="h-6 text-white bg-gray-600 border-gray-500 focus:border-blue-400"
          />
        ) : (
          <span 
            className={`text-white ${onInlineNameUpdate ? 'hover:text-blue-300 transition-colors' : ''}`}
          >
            {participant.name}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onEdit}
          size="sm"
          variant="outline"
          className="border-gray-500 text-gray-300 hover:bg-gray-600"
          disabled={isEditing}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRemove}
          size="sm"
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          disabled={isEditing}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default ParticipantItem

