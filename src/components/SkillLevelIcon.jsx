import { Award, Sprout } from 'lucide-react'

/**
 * Component to display skill level icon based on player weight
 * @param {number} weight - Player weight (0.5 = Beginner, 1.0 = Intermediate, 1.5 = Advanced)
 * @param {number} size - Icon size in pixels (default: 16)
 * @param {string} className - Additional CSS classes
 */
const SkillLevelIcon = ({ weight = 1.0, size = 16, className = '' }) => {
  // Beginner: 0.5
  if (weight <= 0.5) {
    return <Sprout className={`text-green-400 ${className}`} size={size} />
  }
  
  // Advanced: 1.5
  if (weight >= 1.5) {
    return <Award className={`text-yellow-400 ${className}`} size={size} />
  }
  
  // Intermediate: 1.0 (no icon shown)
  return null
}

export default SkillLevelIcon

