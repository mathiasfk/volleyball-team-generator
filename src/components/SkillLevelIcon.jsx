import { Award, Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.jsx'

/**
 * Component to display skill level icon based on player weight
 * @param {number} weight - Player weight (0.5 = Beginner, 1.0 = Intermediate, 1.5 = Advanced)
 * @param {number} size - Icon size in pixels (default: 16)
 * @param {string} className - Additional CSS classes
 * @param {boolean} showTooltip - Whether to show tooltip (default: true)
 */
const SkillLevelIcon = ({ weight = 1.0, size = 16, className = '', showTooltip = true }) => {
  const { t } = useTranslation()
  
  // Beginner: 0.5
  if (weight <= 0.5) {
    const icon = (
      <span aria-label={t('skill_levels.beginner')}>
        <Sprout className={`text-green-400 ${className}`} size={size} />
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
          {t('skill_levels.beginner')}
        </TooltipContent>
      </Tooltip>
    )
  }
  
  // Advanced: 1.5
  if (weight >= 1.5) {
    const icon = (
      <span aria-label={t('skill_levels.advanced')}>
        <Award className={`text-yellow-400 ${className}`} size={size} />
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
          {t('skill_levels.advanced')}
        </TooltipContent>
      </Tooltip>
    )
  }
  
  // Intermediate: 1.0 (no icon shown)
  return null
}

export default SkillLevelIcon

