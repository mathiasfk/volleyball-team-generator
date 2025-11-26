import { CircleFadingArrowUp, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.jsx'

/**
 * Component to display role-specific icons
 * @param {Object} props
 * @param {'libero'|'setter'|'any'} props.role - The player's role
 * @param {number} [props.size=16] - Icon size in pixels
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showTooltip=true] - Whether to show tooltip
 */
const RoleIcon = ({ role, size = 16, className = 'text-blue-400', showTooltip = true }) => {
  const { t } = useTranslation()
  
  if (role === 'libero') {
    const icon = (
      <span aria-label={t('role.libero')}>
        <Shield className={`w-${size} h-${size} ${className}`} style={{ width: size, height: size }} />
      </span>
    )
    
    if (!showTooltip) {
      return icon
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {icon}
        </TooltipTrigger>
        <TooltipContent>
          {t('role.libero')}
        </TooltipContent>
      </Tooltip>
    )
  }
  
  if (role === 'setter') {
    const icon = (
      <span aria-label={t('role.setter')}>
        <CircleFadingArrowUp className={`w-${size} h-${size} ${className}`} style={{ width: size, height: size }} />
      </span>
    )
    
    if (!showTooltip) {
      return icon
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {icon}
        </TooltipTrigger>
        <TooltipContent>
          {t('role.setter')}
        </TooltipContent>
      </Tooltip>
    )
  }
  
  return null
}

export default RoleIcon

