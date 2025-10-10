export function calculateTeams(participants: string[]) {
    // Draw teams based on number of participants
    // Shuffle all participants randomly
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5)

    let formedTeams = []
    let remainingPlayers = []

    if (participants.length < 12) {
      // Less than 12 people: split into 2 teams + 1 on bench
      if (participants.length <= 2) {
        // Very few participants, create only 1 team
        formedTeams.push(shuffledParticipants)
      } else {
        // Split into 2 teams equally, leave 1 out if odd
        const teamSize = Math.floor((participants.length - 1) / 2)
        formedTeams.push(shuffledParticipants.slice(0, teamSize))
        formedTeams.push(shuffledParticipants.slice(teamSize, teamSize * 2))

        // If someone left, goes to bench
        if (shuffledParticipants.length > teamSize * 2) {
          remainingPlayers = shuffledParticipants.slice(teamSize * 2)
        }
      }
    } else {
      // 12 or more people: teams of 6 + rest on bench
      const numberOfTeams = Math.floor(participants.length / 6)

      for (let i = 0; i < numberOfTeams; i++) {
        const start = i * 6
        const end = start + 6
        formedTeams.push(shuffledParticipants.slice(start, end))
      }

      // Remaining people go to bench
      const remaining = participants.length % 6
      if (remaining > 0) {
        remainingPlayers = shuffledParticipants.slice(numberOfTeams * 6)
      }
    }
    return { formedTeams, remainingPlayers }
  }