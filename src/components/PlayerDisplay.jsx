import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input.jsx'

import RoleIcon from './RoleIcon.jsx'
import SkillLevelIcon from './SkillLevelIcon.jsx'

/**
 * Component to display player information with name, skill level, and role icons
 * @param {Object} props
 * @param {Object} props.participant - The participant/player object
 * @param {string} props.participant.name - Player's name
 * @param {number} props.participant.weight - Player's skill level weight
 * @param {'libero'|'setter'|'any'} [props.participant.role] - Player's role
 * @param {number} [props.skillIconSize=14] - Size of the skill level icon
 * @param {number} [props.roleIconSize=16] - Size of the role icon
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {Function} [props.onInlineNameUpdate] - Callback function for inline name updates (id, newName) => boolean
 */
const PlayerDisplay = ({ 
  participant, 
  skillIconSize = 14,
  roleIconSize = 16,
  className = '',
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
    <div 
      className={`flex items-center justify-center gap-2 ${className} ${onInlineNameUpdate && !isEditing ? 'cursor-pointer' : ''}`}
      onClick={onInlineNameUpdate && !isEditing ? handleNameClick : undefined}
    >
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
          className={onInlineNameUpdate ? 'hover:text-blue-300 transition-colors' : ''}
        >
          {participant.name}
        </span>
      )}
      <SkillLevelIcon weight={participant.weight} size={skillIconSize} />
      <RoleIcon role={participant.role} size={roleIconSize} />
    </div>
  )
}

export default PlayerDisplay

