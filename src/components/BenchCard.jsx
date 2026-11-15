import { LayoutList } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

import PlayerDisplay from './PlayerDisplay.jsx'

const BenchCard = ({ benchPlayers, changedPlayerIds = [], onInlineNameUpdate }) => {
  const { t } = useTranslation()

  if (benchPlayers.length === 0) {
    return null
  }

  return (
    <Card className="tour-bench border-[var(--color-border)] bg-[var(--color-card-primary)] py-0">
      <CardHeader className="border-b border-[var(--color-border)] bg-[var(--color-card-secondary)] py-3 text-center">
        <CardTitle className="ds-text-primary flex items-center justify-center gap-2 font-normal text-[var(--color-text-secondary)]">
          <LayoutList className="size-4 shrink-0" aria-hidden />
          {t('results.bench_title')} · {t('results.bench_count', { count: benchPlayers.length })}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 pt-2">
        <div className="space-y-1.5">
          {benchPlayers.map((participant) => {
            const isChanged = changedPlayerIds.includes(participant.id)
            return (
              <div
                key={participant.id}
                className={`player-card-base rounded p-2 text-center text-[var(--color-text-primary)] transition-colors bg-[var(--color-card-secondary)] ${
                  isChanged ? 'player-changed' : ''
                } ${onInlineNameUpdate ? 'hover:bg-[var(--color-border-highlight)]' : ''}`}
              >
                <PlayerDisplay participant={participant} onInlineNameUpdate={onInlineNameUpdate} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default BenchCard

