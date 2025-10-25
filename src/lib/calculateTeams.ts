import { Participant } from './types'

const maxTeams = 2
const maxTeamSize = 6

/**
 * Team Balancing Algorithm
 * 
 * This module creates balanced volleyball teams based on player experience levels.
 * Each participant has a weight that represents their skill level:
 * - Beginner (Iniciante): 0.5
 * - Intermediate (Intermediário): 1.0 (default)
 * - Advanced (Avançado): 1.5
 * 
 * The algorithm distributes players to create teams with similar total weight,
 * ensuring fair and competitive matches.
 */

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
 * Calculates the total weight/experience of a team
 */
function calculateTeamWeight(team: Participant[]): number {
  return team.reduce((sum, player) => sum + (player.weight || 1), 0)
}

/**
 * Checks if a team already has a libero
 */
function hasLibero(team: Participant[]): boolean {
  return team.some(player => player.role === 'libero')
}

/**
 * Checks if a player is a libero
 */
function isLibero(player: Participant): boolean {
  return player.role === 'libero'
}

/**
 * Distributes players into teams balancing by experience weight
 * Enforces the constraint: max 1 libero per team
 */
function distributePlayersIntoTeams(
  players: Participant[],
  playersPerTeam: number
): Participant[][] {
  const teams: Participant[][] = [[], []]
  
  // Separate liberos from regular players
  const liberos = players.filter(isLibero)
  const regularPlayers = players.filter(p => !isLibero(p))
  
  // Sort both groups by weight (descending) for better balancing
  const sortedLiberos = liberos.sort((a, b) => (b.weight || 1) - (a.weight || 1))
  const sortedRegularPlayers = regularPlayers.sort((a, b) => (b.weight || 1) - (a.weight || 1))
  
  // Distribute liberos first (max 1 per team)
  // Assign first libero to team 0, second to team 1
  // Remaining liberos will be left out (returned as bench players)
  for (let i = 0; i < Math.min(sortedLiberos.length, maxTeams); i++) {
    teams[i].push(sortedLiberos[i])
  }
  
  // Distribute regular players using a greedy algorithm:
  // Always add the next player to the team with lower total weight
  for (const player of sortedRegularPlayers) {
    const weight0 = calculateTeamWeight(teams[0])
    const weight1 = calculateTeamWeight(teams[1])
    
    // Add to team with lower weight, or to team with fewer players if weights are equal
    if (weight0 < weight1 || (weight0 === weight1 && teams[0].length < teams[1].length)) {
      if (teams[0].length < playersPerTeam) {
        teams[0].push(player)
      } else {
        teams[1].push(player)
      }
    } else {
      if (teams[1].length < playersPerTeam) {
        teams[1].push(player)
      } else {
        teams[0].push(player)
      }
    }
  }
  
  return teams
}

/**
 * Handles the case where one team is kept and the other is redistributed
 * Enforces the constraint: max 1 libero per team
 * Priority: ALL bench players MUST play if possible
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
  const keptTeamHasLibero = hasLibero(formedTeams[keepTeamId])
  
  // Calculate team size
  const otherTeamSize = calculateTeamSize(participants.length)
  const otherTeamIndex = 1 - keepTeamId
  
  // Get players from the other team
  const otherTeamPlayers = teams[1 - keepTeamId] || []
  
  // Separate bench players by role
  const benchLiberos = benchPlayers.filter(isLibero)
  const benchRegular = benchPlayers.filter(p => !isLibero(p))
  
  // Separate other team players by role
  const otherTeamLiberos = otherTeamPlayers.filter(isLibero)
  const otherTeamRegular = otherTeamPlayers.filter(p => !isLibero(p))
  
  // Build the new team
  const selectedPlayers: Participant[] = []
  
  // PRIORITY 1: Add ALL bench players first (respecting libero constraint)
  // Start with bench liberos (max 1 if kept team doesn't have one, or 0 if it does)
  if (benchLiberos.length > 0 && !keptTeamHasLibero && selectedPlayers.length < otherTeamSize) {
    selectedPlayers.push(benchLiberos[0])
  }
  
  // Add all bench regular players (as many as possible)
  for (const player of benchRegular) {
    if (selectedPlayers.length < otherTeamSize) {
      selectedPlayers.push(player)
    }
  }
  
  // PRIORITY 2: Fill remaining slots from the other team
  // Add libero from other team if we don't have one yet and kept team doesn't have one
  if (otherTeamLiberos.length > 0 && !hasLibero(selectedPlayers) && !keptTeamHasLibero && selectedPlayers.length < otherTeamSize) {
    selectedPlayers.push(otherTeamLiberos[0])
  }
  
  // Fill remaining slots with regular players from other team
  // Sort by weight (descending) to try to balance against the kept team
  const sortedOtherRegular = [...otherTeamRegular].sort((a, b) => (b.weight || 1) - (a.weight || 1))
  
  for (const player of sortedOtherRegular) {
    if (selectedPlayers.length < otherTeamSize) {
      selectedPlayers.push(player)
    }
  }
  
  formedTeams[otherTeamIndex] = selectedPlayers
  
  // Calculate remaining players (those who didn't make it into the teams)
  const playingIds = new Set([
    ...formedTeams[0].map(p => p.id),
    ...formedTeams[1].map(p => p.id)
  ])
  
  const remainingPlayers = participants.filter(p => !playingIds.has(p.id))
  
  return { formedTeams, remainingPlayers }
}

/**
 * Performs a full team draw with all participants
 */
function performFullDraw(
  participants: Participant[],
  benchPlayers: Participant[]
): { formedTeams: Participant[][], remainingPlayers: Participant[] } {
  // Calculate team composition
  const playersPerTeam = calculateTeamSize(participants.length)
  const totalPlayingPlayers = playersPerTeam * maxTeams
  
  // Separate liberos and regular players
  const allLiberos = participants.filter(isLibero)
  const allRegularPlayers = participants.filter(p => !isLibero(p))
  
  // Prioritize bench players within each group
  const benchPlayerIds = new Set(benchPlayers.map(bp => bp.id))
  
  // Shuffle liberos with bench players prioritized
  const benchLiberos = allLiberos.filter(l => benchPlayerIds.has(l.id))
  const otherLiberos = allLiberos.filter(l => !benchPlayerIds.has(l.id))
  const shuffledLiberos = [...shuffle(benchLiberos), ...shuffle(otherLiberos)]
  
  // Shuffle regular players with bench players prioritized
  const benchRegular = allRegularPlayers.filter(p => benchPlayerIds.has(p.id))
  const otherRegular = allRegularPlayers.filter(p => !benchPlayerIds.has(p.id))
  const shuffledRegular = [...shuffle(benchRegular), ...shuffle(otherRegular)]
  
  // Take max 2 liberos for playing (one per team)
  const playingLiberos = shuffledLiberos.slice(0, Math.min(2, shuffledLiberos.length))
  const benchLiberos2 = shuffledLiberos.slice(Math.min(2, shuffledLiberos.length))
  
  // Calculate remaining slots for regular players
  const regularSlotsNeeded = totalPlayingPlayers - playingLiberos.length
  const playingRegular = shuffledRegular.slice(0, regularSlotsNeeded)
  const benchRegular2 = shuffledRegular.slice(regularSlotsNeeded)
  
  // Combine playing players
  const playingPlayers = [...playingLiberos, ...playingRegular]
  
  // Distribute into teams (will respect libero constraint)
  const formedTeams = distributePlayersIntoTeams(playingPlayers, playersPerTeam)
  
  // Remaining players on bench
  const remainingPlayers = [...benchLiberos2, ...benchRegular2]
  
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