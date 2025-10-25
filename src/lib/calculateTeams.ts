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
 * Distributes players into teams balancing by experience weight
 */
function distributePlayersIntoTeams(
  players: Participant[],
  playersPerTeam: number
): Participant[][] {
  const teams: Participant[][] = [[], []]
  
  // Sort players by weight (descending) to better balance teams
  const sortedPlayers = [...players].sort((a, b) => {
    const weightA = a.weight || 1
    const weightB = b.weight || 1
    return weightB - weightA
  })
  
  // Distribute players using a greedy algorithm:
  // Always add the next player to the team with lower total weight
  for (const player of sortedPlayers) {
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
  
  // Prioritize bench players
  const benchPlayerIds = new Set(benchPlayers.map(bp => bp.id))
  const benchPlayersFirst = uniquePlayers.filter(p => benchPlayerIds.has(p.id))
  const otherPlayers = uniquePlayers.filter(p => !benchPlayerIds.has(p.id))
  
  // Sort each group by weight (descending) for better balancing
  const sortedBench = benchPlayersFirst.sort((a, b) => (b.weight || 1) - (a.weight || 1))
  const sortedOthers = otherPlayers.sort((a, b) => (b.weight || 1) - (a.weight || 1))
  
  // Shuffle within each weight group to add some randomness
  const shuffledBench = shuffle(sortedBench)
  const shuffledOthers = shuffle(sortedOthers)
  const prioritizedPlayers = [...shuffledBench, ...shuffledOthers]
  
  // Calculate team size
  const otherTeamSize = calculateTeamSize(participants.length)
  const otherTeamIndex = 1 - keepTeamId
  
  // Build the other team by selecting players that balance against the kept team
  // Use greedy approach: try to get as close as possible to the kept team's weight
  const selectedPlayers: Participant[] = []
  const remainingPool = [...prioritizedPlayers]
  
  while (selectedPlayers.length < otherTeamSize && remainingPool.length > 0) {
    const currentWeight = calculateTeamWeight(selectedPlayers)
    const targetWeight = keptTeamWeight
    const remainingSlots = otherTeamSize - selectedPlayers.length
    
    // Find the best player to add (one that gets us closest to target weight)
    let bestIndex = 0
    let bestDifference = Math.abs(targetWeight - (currentWeight + (remainingPool[0].weight || 1)))
    
    for (let i = 1; i < Math.min(remainingPool.length, remainingSlots * 2); i++) {
      const playerWeight = remainingPool[i].weight || 1
      const newDifference = Math.abs(targetWeight - (currentWeight + playerWeight))
      
      if (newDifference < bestDifference) {
        bestDifference = newDifference
        bestIndex = i
      }
    }
    
    selectedPlayers.push(remainingPool[bestIndex])
    remainingPool.splice(bestIndex, 1)
  }
  
  formedTeams[otherTeamIndex] = selectedPlayers
  const remainingPlayers = remainingPool
  
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