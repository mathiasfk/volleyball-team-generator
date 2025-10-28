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
 */
const PlayerDisplay = ({ 
  participant, 
  skillIconSize = 14,
  roleIconSize = 16,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span>{participant.name}</span>
      <SkillLevelIcon weight={participant.weight} size={skillIconSize} />
      <RoleIcon role={participant.role} size={roleIconSize} />
    </div>
  )
}

export default PlayerDisplay

