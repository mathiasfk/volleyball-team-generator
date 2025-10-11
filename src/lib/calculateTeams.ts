const maxTeams = 2
const maxTeamSize = 6

export function calculateTeams(participants: string[]) {
    // Validate input to make sure we have the actual number of players we're claiming
    const availablePlayers = participants.length
    
    // Initialize return values - always have 2 teams
    let formedTeams = [[], []]
    let remainingPlayers = []
    
    // Special case: if we have 0 or 1 player, they go to bench
    if (availablePlayers <= 1) {
      return { formedTeams, remainingPlayers: participants }
    }
    
    // Shuffle all participants randomly
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5)
    
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