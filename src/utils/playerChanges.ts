/**
 * Utility functions to detect player changes between draws
 */

export interface PlayerPosition {
  teamIndex: number | null // null for bench
  position: number // position in team or bench
}

/**
 * Creates a map of player IDs to their positions
 */
export function createPlayerPositionMap(
  teams: any[][],
  benchPlayers: any[]
): Map<string, PlayerPosition> {
  const positionMap = new Map<string, PlayerPosition>()

  // Map team players
  teams.forEach((team, teamIndex) => {
    team.forEach((player, position) => {
      positionMap.set(player.id, { teamIndex, position })
    })
  })

  // Map bench players
  benchPlayers.forEach((player, position) => {
    positionMap.set(player.id, { teamIndex: null, position })
  })

  return positionMap
}

/**
 * Detects which players have changed positions
 */
export function detectPlayerChanges(
  previousPositions: Map<string, PlayerPosition> | null,
  newTeams: any[][],
  newBenchPlayers: any[]
): Set<string> {
  if (!previousPositions) {
    return new Set()
  }

  const changedPlayers = new Set<string>()
  const newPositions = createPlayerPositionMap(newTeams, newBenchPlayers)

  // Check all players in new positions
  newPositions.forEach((newPos, playerId) => {
    const oldPos = previousPositions.get(playerId)

    // Player is new or changed position
    if (!oldPos || oldPos.teamIndex !== newPos.teamIndex) {
      changedPlayers.add(playerId)
    }
  })

  return changedPlayers
}

