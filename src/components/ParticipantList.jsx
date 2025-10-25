import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge.jsx'

import ParticipantItem from './ParticipantItem.jsx'

const ParticipantList = ({ 
  participants,
  onEdit,
  onRemove
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="space-y-2">
        {participants.map((participant) => (
          <ParticipantItem
            key={participant.id}
            participant={participant}
            onEdit={() => onEdit(participant)}
            onRemove={() => onRemove(participant.id)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <Badge variant="secondary" className="bg-gray-700 text-white">
          {t('participants.total', { count: participants.length })}
        </Badge>
      </div>
    </>
  )
}

export default ParticipantList

