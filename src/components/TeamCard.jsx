import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

const TeamCard = ({ team, teamColor, _index, changedPlayerIds = [] }) => {
  const { t } = useTranslation()

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader
        className="text-center"
        style={{ backgroundColor: teamColor.color }}
      >
        <CardTitle
          className="text-xl font-bold"
          style={{ color: teamColor.textColor }}
        >
          {t('results.team', { color: teamColor.name })}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {team.map((participant, idx) => {
            const isChanged = changedPlayerIds.includes(participant.id)
            return (
              <div
                key={participant.id}
                className={`bg-gray-700 p-2 rounded text-center text-white transition-all duration-300 ${
                  isChanged ? 'player-changed' : ''
                }`}
              >
                {idx + 1}. {participant.name}
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-center">
          <Badge
            className="text-white"
            style={{ backgroundColor: teamColor.color }}
          >
            {t('results.players_count', { count: team.length })}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamCard

