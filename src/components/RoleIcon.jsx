import { useTranslation } from 'react-i18next'

export default function RoleIcon({ role, className = '' }) {
  const { t } = useTranslation()
  return role === 'libero' || role === 'setter' ? <span className={className}>{t(`role.${role}`)}</span> : null
}
