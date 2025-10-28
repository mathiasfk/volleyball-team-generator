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
 * Sorts participants by games played (ascending), prioritizing those who played fewer games
 * Players with same gamesPlayed are randomly shuffled
 */
function sortByGamesPlayed(participants: Participant[]): Participant[] {
  // Group by gamesPlayed
  const groups = new Map<number, Participant[]>()
  
  participants.forEach(p => {
    const games = p.gamesPlayed || 0
    if (!groups.has(games)) {
      groups.set(games, [])
    }
    groups.get(games)!.push(p)
  })
  
  // Sort groups by games played and shuffle within each group
  const sortedGroups = Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0]) // Sort by gamesPlayed ascending
  
  // Flatten and shuffle within each group
  return sortedGroups.flatMap(([_, group]) => shuffle(group))
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
 * 
 * Priority order (from highest to lowest):
 * 1. Enforce constraint: max 1 libero per team (can play with 0 liberos)
 * 2. Balance games played - players with fewer games MUST play first
 * 3. Balance team weights for fair competition
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
  
  // Calculate team size
  const otherTeamSize = calculateTeamSize(participants.length)
  const otherTeamIndex = 1 - keepTeamId
  
  // Get players from the other team
  const otherTeamPlayers = teams[1 - keepTeamId] || []
  
  // Combine ALL available players (bench + other team)
  const availablePlayers = [...benchPlayers, ...otherTeamPlayers]
  
  // Sort by gamesPlayed (ascending) - PRIORITY #2: fewer games first
  // Then by weight (descending) for balancing - PRIORITY #3
  const sortedAvailable = availablePlayers.sort((a, b) => {
    const gamesA = a.gamesPlayed || 0
    const gamesB = b.gamesPlayed || 0
    if (gamesA !== gamesB) {
      return gamesA - gamesB // Fewer games MUST play first
    }
    return (b.weight || 1) - (a.weight || 1) // Then balance by weight
  })
  
  // Select players respecting the libero constraint - PRIORITY #1
  const selectedPlayers: Participant[] = []
  let selectedHasLibero = false
  
  for (const player of sortedAvailable) {
    // Stop if team is full
    if (selectedPlayers.length >= otherTeamSize) {
      break
    }
    
    // Check libero constraint - PRIORITY #1
    // Each team can have max 1 libero independently
    if (isLibero(player)) {
      // Skip this libero if we already selected a libero for this team
      if (selectedHasLibero) {
        continue // Skip to next player in the sorted list
      }
      selectedHasLibero = true
    }
    
    selectedPlayers.push(player)
  }
  
  formedTeams[otherTeamIndex] = selectedPlayers
  
  // Calculate remaining players (those who didn't make it into the teams)
  const playingIds = new Set([
    ...formedTeams[0].map(p => p.id),
    ...formedTeams[1].map(p => p.id)
  ])
  
  const remainingPlayers = participants.filter(p => !playingIds.has(p.id));

  debugTeams(participants, formedTeams, remainingPlayers)
  return { formedTeams, remainingPlayers }
}

/**
 * Performs a full team draw with all participants
 * Priority order:
 * 1. Bench players MUST play if possible (highest priority)
 * 2. Players with fewer gamesPlayed are preferred
 * 3. Players with more gamesPlayed are more likely to sit out
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
  
  // Priority 1: Bench players (must play) - sorted by gamesPlayed to ensure fairness
  // Priority 2: Non-bench players sorted by gamesPlayed (fewer games first)
  const benchLiberos = allLiberos.filter(l => benchPlayerIds.has(l.id))
  const otherLiberos = allLiberos.filter(l => !benchPlayerIds.has(l.id))
  const shuffledLiberos = [...sortByGamesPlayed(benchLiberos), ...sortByGamesPlayed(otherLiberos)]
  
  const benchRegular = allRegularPlayers.filter(p => benchPlayerIds.has(p.id))
  const otherRegular = allRegularPlayers.filter(p => !benchPlayerIds.has(p.id))
  const shuffledRegular = [...sortByGamesPlayed(benchRegular), ...sortByGamesPlayed(otherRegular)]
  
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
  
  debugTeams(participants, formedTeams, remainingPlayers)
  return { formedTeams, remainingPlayers }
}

const debugTeams = (participants: Participant[], formedTeams: Participant[][], remainingPlayers: Participant[]) => {
  // Debug (only in browser, not in tests)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // team weights and difference
    const team0Weight = calculateTeamWeight(formedTeams[0])
    const team1Weight = calculateTeamWeight(formedTeams[1])
    const difference = Math.abs(team0Weight - team1Weight)
    console.log('# weights')
    console.log('team0Weight', team0Weight)
    console.log('team1Weight', team1Weight)
    console.log('difference', difference)

    // payed games of each player in each team
    console.log('# team0')
    formedTeams[0].forEach(p => {
      console.log(' - ', p.name, p.gamesPlayed)
    })
    console.log('# team1')
    formedTeams[1].forEach(p => {
      console.log(' - ',p.name, p.gamesPlayed)
    })
    console.log('# remainingPlayers')
    remainingPlayers.forEach(p => {
      console.log(' - ',p.name, p.gamesPlayed)
    })
  }
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