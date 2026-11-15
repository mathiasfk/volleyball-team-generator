import { useTranslation } from 'react-i18next'

export default function SkillLevelIcon({ weight = 1, className = '' }) {
  const { t } = useTranslation()
  const level = weight <= 0.5 ? 'beginner' : weight >= 1.5 ? 'advanced' : 'intermediate'
  return <span className={className}>{t(`skill_levels.${level}`)}</span>
}
