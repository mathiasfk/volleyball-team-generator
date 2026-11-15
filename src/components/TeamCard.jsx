import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

import PlayerDisplay from './PlayerDisplay.jsx'

const TeamCard = ({ team, teamColor, _index, changedPlayerIds = [], onInlineNameUpdate }) => {
  const { t } = useTranslation()

  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-card-primary)]">
      <CardHeader>
        <CardTitle className="ds-text-section flex items-center gap-2">
          <span className="w-2 h-6 rounded-full" style={{ backgroundColor: teamColor.color }} aria-hidden="true" />
          {t('results.team', { color: teamColor.name })}
          <span className="text-sm font-normal text-muted-foreground">{t('results.players_count', { count: team.length })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {team.map((participant, _) => {
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

export default TeamCard

