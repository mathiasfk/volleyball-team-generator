import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

const BenchCard = ({ benchPlayers, changedPlayerIds = [] }) => {
  const { t } = useTranslation()

  if (benchPlayers.length === 0) {
    return null
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="text-center bg-orange-600">
        <CardTitle className="text-xl font-bold text-white">
          {t('results.bench_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {benchPlayers.map((participant) => {
            const isChanged = changedPlayerIds.includes(participant.id)
            return (
              <div
                key={participant.id}
                className={`player-card-base bg-gray-700 p-2 rounded text-center text-white ${
                  isChanged ? 'player-changed' : ''
                }`}
              >
                {participant.name}
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-center">
          <Badge className="bg-orange-600 text-white">
            {t('results.bench_count', { count: benchPlayers.length })}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default BenchCard

