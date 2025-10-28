import { CircleFadingArrowUp, Shield } from 'lucide-react'

/**
 * Component to display role-specific icons
 * @param {Object} props
 * @param {'libero'|'setter'|'any'} props.role - The player's role
 * @param {number} [props.size=16] - Icon size in pixels
 * @param {string} [props.className] - Additional CSS classes
 */
const RoleIcon = ({ role, size = 16, className = 'text-blue-400' }) => {
  if (role === 'libero') {
    return <Shield className={`w-${size} h-${size} ${className}`} style={{ width: size, height: size }} />
  }
  
  if (role === 'setter') {
    return <CircleFadingArrowUp className={`w-${size} h-${size} ${className}`} style={{ width: size, height: size }} />
  }
  
  return null
}

export default RoleIcon

