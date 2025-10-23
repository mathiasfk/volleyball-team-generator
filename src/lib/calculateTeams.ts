const maxTeams = 2
const maxTeamSize = 6

export function calculateTeams(options: {
  participants: string[]
  teams?: string[][]
  benchPlayers?: string[]
  keepTeamId?: number
}) {
  const {
    participants,
    teams = [],
    benchPlayers = [],
    keepTeamId,
  } = options;

  // Validate input to make sure we have the actual number of players we're claiming
  const availablePlayers = participants.length

  // Initialize return values - always have 2 teams
  let formedTeams = [[], []]
  let remainingPlayers = []

  // Special case: if we have 0 or 1 player, they go to bench
  if (availablePlayers <= 1) {
    return { formedTeams, remainingPlayers: participants }
  }

  // If keepTeamId is specified, preserve that team and only redistribute the other team
  if (keepTeamId !== undefined && teams.length > 0 && teams[keepTeamId]) {
    // Keep the specified team intact
    formedTeams[keepTeamId] = [...teams[keepTeamId]]
    
    // Get all players that are NOT in the kept team
    const keptTeamPlayers = new Set(teams[keepTeamId])
    const otherTeamPlayers = teams[1 - keepTeamId] || []
    
    // Create a set of all players that are already assigned (kept team + other team + bench)
    const alreadyAssigned = new Set([
      ...Array.from(keptTeamPlayers),
      ...otherTeamPlayers,
      ...benchPlayers
    ])
    
    // Get all available players for redistribution (excluding those already assigned)
    const availableForRedistribution = [
      ...otherTeamPlayers,
      ...benchPlayers,
      ...participants.filter(p => !alreadyAssigned.has(p))
    ]
    
    // Remove duplicates while preserving order
    const uniqueAvailablePlayers = Array.from(new Set(availableForRedistribution))
    
    // Shuffle available players for redistribution
    const shuffledAvailable = [...uniqueAvailablePlayers].sort(() => Math.random() - 0.5)
    
    // Calculate how many players the other team should have
    const otherTeamSize = Math.min(maxTeamSize, Math.floor(availablePlayers / maxTeams))
    
    // Ensure all bench players are included in the new teams
    // First, add all bench players to the other team
    const benchPlayersToInclude = benchPlayers.filter(bp => shuffledAvailable.includes(bp))
    const nonBenchPlayers = shuffledAvailable.filter(p => !benchPlayers.includes(p))
    
    // Combine bench players first, then other players
    const prioritizedPlayers = [...benchPlayersToInclude, ...nonBenchPlayers]
    
    // Fill the other team with prioritized players
    formedTeams[1 - keepTeamId] = prioritizedPlayers.slice(0, otherTeamSize)
    
    // Remaining players go to bench
    remainingPlayers = prioritizedPlayers.slice(otherTeamSize)
    
    return { formedTeams, remainingPlayers }
  }

  // Priority: bench players from previous round should be included in new teams
  let playersToDistribute = [...participants]
  
  // If we have previous bench players, ensure they are all included in teams
  if (benchPlayers.length > 0) {
    // Remove bench players from the main participants list to avoid duplicates
    playersToDistribute = participants.filter(p => !benchPlayers.includes(p))
    // Add bench players at the beginning (they'll be prioritized and included)
    playersToDistribute = [...benchPlayers, ...playersToDistribute]
  }

  // Shuffle all participants randomly, but keep bench players at the front
  const benchPlayersShuffled = benchPlayers.length > 0 ? [...benchPlayers].sort(() => Math.random() - 0.5) : []
  const otherPlayersShuffled = benchPlayers.length > 0 
    ? [...participants.filter(p => !benchPlayers.includes(p))].sort(() => Math.random() - 0.5)
    : [...participants].sort(() => Math.random() - 0.5)
  
  const shuffledParticipants = [...benchPlayersShuffled, ...otherPlayersShuffled]

  // Calculate players per team - try to get as close to 6 as possible
  // while keeping teams balanced
  let playersPerTeam = Math.min(
    maxTeamSize,
    Math.floor(availablePlayers / maxTeams)
  )

  // Must have at least 1 player per team
  playersPerTeam = Math.max(1, playersPerTeam)

  // Calculate total players that will be playing (not on bench)
  const totalPlayingPlayers = playersPerTeam * maxTeams

  // Everyone else goes to the bench
  remainingPlayers = shuffledParticipants.slice(totalPlayingPlayers)

  // Distribute playing players into teams
  const playingPlayers = shuffledParticipants.slice(0, totalPlayingPlayers)
  for (let i = 0; i < playingPlayers.length; i++) {
    const teamIndex = Math.floor(i / playersPerTeam)
    formedTeams[teamIndex].push(playingPlayers[i])
  }

  return { formedTeams, remainingPlayers }
}