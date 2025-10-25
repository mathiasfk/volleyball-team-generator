import { Participant } from './types'

const maxTeams = 2
const maxTeamSize = 6

// Helper functions for better code organization

/**
 * Sorts participants alphabetically by name
 */
function sortByName(participants: Participant[]): Participant[] {
  return participants.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Shuffles an array randomly
 */
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

/**
 * Calculates optimal team size based on available players
 */
function calculateTeamSize(totalPlayers: number): number {
  const playersPerTeam = Math.floor(totalPlayers / maxTeams)
  return Math.max(1, Math.min(maxTeamSize, playersPerTeam))
}

/**
 * Removes duplicate participants based on their ID
 */
function removeDuplicates(participants: Participant[]): Participant[] {
  return participants.filter(
    (player, index, self) => self.findIndex(p => p.id === player.id) === index
  )
}

/**
 * Distributes players into teams evenly
 */
function distributePlayersIntoTeams(
  players: Participant[],
  playersPerTeam: number
): Participant[][] {
  const teams: Participant[][] = [[], []]
  
  for (let i = 0; i < players.length; i++) {
    const teamIndex = Math.floor(i / playersPerTeam)
    teams[teamIndex].push(players[i])
  }
  
  return teams
}

/**
 * Prioritizes bench players by placing them first in the list
 */
function prioritizeBenchPlayers(
  allPlayers: Participant[],
  benchPlayers: Participant[]
): Participant[] {
  if (benchPlayers.length === 0) {
    return shuffle(allPlayers)
  }
  
  const benchPlayerIds = new Set(benchPlayers.map(bp => bp.id))
  const benchShuffled = shuffle(benchPlayers)
  const othersShuffled = shuffle(allPlayers.filter(p => !benchPlayerIds.has(p.id)))
  
  return [...benchShuffled, ...othersShuffled]
}

/**
 * Handles the case where one team is kept and the other is redistributed
 */
function redistributeWithKeptTeam(
  participants: Participant[],
  teams: Participant[][],
  benchPlayers: Participant[],
  keepTeamId: number
): { formedTeams: Participant[][], remainingPlayers: Participant[] } {
  const formedTeams: Participant[][] = [[], []]
  
  // Keep the specified team intact
  formedTeams[keepTeamId] = [...teams[keepTeamId]]
  
  // Get players available for redistribution
  const otherTeamPlayers = teams[1 - keepTeamId] || []
  const alreadyAssigned = new Set([
    ...teams[keepTeamId].map(p => p.id),
    ...otherTeamPlayers.map(p => p.id),
    ...benchPlayers.map(p => p.id)
  ])
  
  const availableForRedistribution = [
    ...otherTeamPlayers,
    ...benchPlayers,
    ...participants.filter(p => !alreadyAssigned.has(p.id))
  ]
  
  // Remove duplicates and shuffle
  const uniquePlayers = removeDuplicates(availableForRedistribution)
  const shuffledPlayers = shuffle(uniquePlayers)
  
  // Prioritize bench players
  const benchPlayerIds = new Set(benchPlayers.map(bp => bp.id))
  const benchPlayersFirst = shuffledPlayers.filter(p => benchPlayerIds.has(p.id))
  const otherPlayers = shuffledPlayers.filter(p => !benchPlayerIds.has(p.id))
  const prioritizedPlayers = [...benchPlayersFirst, ...otherPlayers]
  
  // Calculate team size and distribute
  const otherTeamSize = calculateTeamSize(participants.length)
  formedTeams[1 - keepTeamId] = prioritizedPlayers.slice(0, otherTeamSize)
  const remainingPlayers = prioritizedPlayers.slice(otherTeamSize)
  
  return { formedTeams, remainingPlayers }
}

/**
 * Performs a full team draw with all participants
 */
function performFullDraw(
  participants: Participant[],
  benchPlayers: Participant[]
): { formedTeams: Participant[][], remainingPlayers: Participant[] } {
  // Shuffle with bench players prioritized
  const shuffledParticipants = prioritizeBenchPlayers(participants, benchPlayers)
  
  // Calculate team composition
  const playersPerTeam = calculateTeamSize(participants.length)
  const totalPlayingPlayers = playersPerTeam * maxTeams
  
  // Split into playing and bench
  const playingPlayers = shuffledParticipants.slice(0, totalPlayingPlayers)
  const remainingPlayers = shuffledParticipants.slice(totalPlayingPlayers)
  
  // Distribute into teams
  const formedTeams = distributePlayersIntoTeams(playingPlayers, playersPerTeam)
  
  return { formedTeams, remainingPlayers }
}

/**
 * Main function to calculate team distributions
 */
export function calculateTeams(options: {
  participants: Participant[]
  teams?: Participant[][]
  benchPlayers?: Participant[]
  keepTeamId?: number
}) {
  const {
    participants,
    teams = [],
    benchPlayers = [],
    keepTeamId,
  } = options

  // Initialize return values
  let formedTeams: Participant[][] = [[], []]
  let remainingPlayers: Participant[] = []

  // Special case: insufficient players
  if (participants.length <= 1) {
    remainingPlayers = sortByName(participants)
    return { formedTeams, remainingPlayers }
  }

  // Case 1: Keep one team and redistribute the other
  if (keepTeamId !== undefined && teams.length > 0 && teams[keepTeamId]) {
    const result = redistributeWithKeptTeam(participants, teams, benchPlayers, keepTeamId)
    formedTeams = result.formedTeams
    remainingPlayers = result.remainingPlayers
  } 
  // Case 2: Full team draw
  else {
    const result = performFullDraw(participants, benchPlayers)
    formedTeams = result.formedTeams
    remainingPlayers = result.remainingPlayers
  }

  // Always sort participants by name before returning
  formedTeams = formedTeams.map(team => sortByName(team))
  remainingPlayers = sortByName(remainingPlayers)

  return { formedTeams, remainingPlayers }
}