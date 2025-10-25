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
 * Removes duplicate participants based on their ID
 */
function removeDuplicates(participants: Participant[]): Participant[] {
  return participants.filter(
    (player, index, self) => self.findIndex(p => p.id === player.id) === index
  )
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
 * Enforces the constraint: max 1 libero per team
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
  const keptTeamWeight = calculateTeamWeight(formedTeams[keepTeamId])
  const keptTeamHasLibero = hasLibero(formedTeams[keepTeamId])
  
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
  
  // Remove duplicates
  const uniquePlayers = removeDuplicates(availableForRedistribution)
  
  // Separate liberos and regular players
  const availableLiberos = uniquePlayers.filter(isLibero)
  const availableRegularPlayers = uniquePlayers.filter(p => !isLibero(p))
  
  // Prioritize bench players within each group
  const benchPlayerIds = new Set(benchPlayers.map(bp => bp.id))
  
  // Sort liberos and regular players
  const sortedLiberos = availableLiberos.sort((a, b) => {
    const aIsBench = benchPlayerIds.has(a.id)
    const bIsBench = benchPlayerIds.has(b.id)
    if (aIsBench && !bIsBench) return -1
    if (!aIsBench && bIsBench) return 1
    return (b.weight || 1) - (a.weight || 1)
  })
  
  const sortedRegularPlayers = availableRegularPlayers.sort((a, b) => {
    const aIsBench = benchPlayerIds.has(a.id)
    const bIsBench = benchPlayerIds.has(b.id)
    if (aIsBench && !bIsBench) return -1
    if (!aIsBench && bIsBench) return 1
    return (b.weight || 1) - (a.weight || 1)
  })
  
  // Add some randomness
  const shuffledLiberos = shuffle(sortedLiberos)
  const shuffledRegularPlayers = shuffle(sortedRegularPlayers)
  
  // Calculate team size
  const otherTeamSize = calculateTeamSize(participants.length)
  const otherTeamIndex = 1 - keepTeamId
  
  // Build the other team by selecting players that balance against the kept team
  const selectedPlayers: Participant[] = []
  let remainingLiberos = [...shuffledLiberos]
  let remainingRegularPlayers = [...shuffledRegularPlayers]
  
  // Try to add a libero to the new team (max 1 libero per team)
  if (remainingLiberos.length > 0 && selectedPlayers.length < otherTeamSize) {
    selectedPlayers.push(remainingLiberos[0])
    remainingLiberos = remainingLiberos.slice(1)
  }
  
  // Fill the rest of the team with regular players
  while (selectedPlayers.length < otherTeamSize && remainingRegularPlayers.length > 0) {
    const currentWeight = calculateTeamWeight(selectedPlayers)
    const targetWeight = keptTeamWeight
    const remainingSlots = otherTeamSize - selectedPlayers.length
    
    // Find the best player to add (one that gets us closest to target weight)
    let bestIndex = 0
    let bestDifference = Math.abs(targetWeight - (currentWeight + (remainingRegularPlayers[0].weight || 1)))
    
    for (let i = 1; i < Math.min(remainingRegularPlayers.length, remainingSlots * 2); i++) {
      const playerWeight = remainingRegularPlayers[i].weight || 1
      const newDifference = Math.abs(targetWeight - (currentWeight + playerWeight))
      
      if (newDifference < bestDifference) {
        bestDifference = newDifference
        bestIndex = i
      }
    }
    
    selectedPlayers.push(remainingRegularPlayers[bestIndex])
    remainingRegularPlayers.splice(bestIndex, 1)
  }
  
  formedTeams[otherTeamIndex] = selectedPlayers
  const remainingPlayers = [...remainingLiberos, ...remainingRegularPlayers]
  
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

  // Debug stats:
  // 1. Sum of weights of all player for each team
  const team0Weight = calculateTeamWeight(formedTeams[0])
  const team1Weight = calculateTeamWeight(formedTeams[1])
  console.log('Team 0 weight:', team0Weight)
  console.log('Team 1 weight:', team1Weight)
  console.log('Difference:', Math.abs(team0Weight - team1Weight))

  return { formedTeams, remainingPlayers }
}