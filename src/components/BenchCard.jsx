import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const BenchCard = ({ benchPlayers }) => {
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
          {benchPlayers.map((participant) => (
            <div
              key={participant.id}
              className="bg-gray-700 p-2 rounded text-center text-white"
            >
              {participant.nome}
            </div>
          ))}
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

