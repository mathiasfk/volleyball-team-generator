import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  className = '',
  onInlineNameUpdate
}) => {
  const { t } = useTranslation()
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
    <div className={`min-w-0 text-start ${className}`}>
      {isEditing ? (
        <Input ref={inputRef} value={editingName} onChange={(e) => setEditingName(e.target.value)}
          onKeyDown={handleKeyDown} onBlur={handleBlur} aria-label={t('participants.edit') + ': ' + participant.name}
          className="min-w-0 w-full bg-card border-input" />
      ) : onInlineNameUpdate ? (
        <button type="button" onClick={handleNameClick} className="block max-w-full text-start break-words rounded hover:text-[var(--link)]"
          aria-label={t('participants.edit') + ': ' + participant.name}>{participant.name}</button>
      ) : <span className="block break-words">{participant.name}</span>}
      <div className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
        <SkillLevelIcon weight={participant.weight} />
        {participant.role && participant.role !== 'any' && <><span aria-hidden="true">·</span><RoleIcon role={participant.role} /></>}
      </div>
    </div>
  )
}

export default PlayerDisplay
