import { describe, expect, test } from 'vitest'

import { calculateTeams } from './calculateTeams'
import { Participant } from './types'

describe('calculateTeams', () => {

  describe('should create two balanced teams', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const { formedTeams } = calculateTeams({participants})
      expect(formedTeams).toHaveLength(2)
      expect(formedTeams[0].length).toBe(formedTeams[1].length) // Teams should be balanced
    })
  })

  describe('should create two balanced teams on new match', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const prevMatch = calculateTeams({participants})
      const { formedTeams } = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId: [null, 0, 1][Math.floor(Math.random()*2)] // randomly keep one team intact
      })
      expect(formedTeams).toHaveLength(2)
      expect(formedTeams[0].length).toBe(formedTeams[1].length) // Teams should be balanced
    })
  })

  describe('should leave people on the bench', () => {
    test.for([
      [1, 1],
      [0, 2],
      [1, 3],
      [0, 4],
      [0, 6],
      [1, 7],
      [0, 8],
      [0, 12],
      [1, 13],
      [5, 17],
    ])('%i on bench with %i participants', ([expectedBenchCount, numberOfParticipants]) => {
      const participants = generateParticipants(numberOfParticipants)
      const { remainingPlayers } = calculateTeams({participants})
      expect(remainingPlayers).toHaveLength(expectedBenchCount)
    })
  })

  describe('should leave people on the bench on new match', () => {
    test.for([
      [1, 1],
      [0, 2],
      [1, 3],
      [0, 4],
      [0, 6],
      [1, 7],
      [0, 8],
      [0, 12],
      [1, 13],
      [5, 17],
    ])('%i on bench with %i participants', ([expectedBenchCount, numberOfParticipants]) => {
      const participants = generateParticipants(numberOfParticipants)
      const prevMatch = calculateTeams({participants})
      const { remainingPlayers } = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId: [null, 0, 1][Math.floor(Math.random()*2)] // randomly keep one team intact
      })
      expect(remainingPlayers).toHaveLength(expectedBenchCount)
    })
  })

  describe('should be no missing people on new match', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const prevMatch = calculateTeams({participants})
      const { formedTeams, remainingPlayers } = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId: [null, 0, 1][Math.floor(Math.random()*2)] // randomly keep one team intact
      })
      const peoplePlaying = formedTeams.flat().length
      const peopleOnBench = remainingPlayers.length
      expect(peoplePlaying + peopleOnBench).toBe(numberOfParticipants)
    })
  })

  describe('should be no missing people', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const { formedTeams, remainingPlayers } = calculateTeams({participants})
      const peoplePlaying = formedTeams.flat().length
      const peopleOnBench = remainingPlayers.length
      expect(peoplePlaying + peopleOnBench).toBe(numberOfParticipants)
    })
  })

  describe('should have at most 6 players per team', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const { formedTeams } = calculateTeams({participants})
      
      expect(formedTeams[0].length).toBeLessThanOrEqual(6)
      expect(formedTeams[1].length).toBeLessThanOrEqual(6)
      expect(formedTeams[0].length).toBeGreaterThanOrEqual(1)
      expect(formedTeams[1].length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('should include all bench players from previous round', () => {
    test.for([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    ])('%i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)

      const prevMatch = calculateTeams({participants})
      const newMatch = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers
      })
      
      const newMatchPlayerIds = newMatch.formedTeams.flat().map(p => p.id)
      const benchPlayerIds = prevMatch.remainingPlayers.map(p => p.id)
      expect(newMatchPlayerIds).toEqual(
        expect.arrayContaining(benchPlayerIds)
      )
    })
  })

  describe('should keep team intact if specificed', () => {
    test.for([
      [3, 0],
      [3, 1],
      [5, 0],
      [5, 1],
      [7, 0],
      [7, 1],
      [13, 0],
      [13, 1],
      [16, 0],
      [16, 1],
      [36, 0],
      [36, 1],
    ])('with %i participants, keep team %i intact', ([numberOfParticipants, keepTeamId]) => {
      const participants = generateParticipants(numberOfParticipants)

      const prevMatch = calculateTeams({participants})
      const newMatch = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId
      })

      const newTeamIds = newMatch.formedTeams[keepTeamId].map(p => p.id)
      const prevTeamIds = prevMatch.formedTeams[keepTeamId].map(p => p.id)
      expect(newTeamIds).toEqual(prevTeamIds)
    })
  })

  describe('should not repeat players between teams', () => {
    test.for([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    ])('with %i participants', (numberOfParticipants) => {
      const participants = generateParticipants(numberOfParticipants)
      const { formedTeams, remainingPlayers } = calculateTeams({participants})

      const team0Ids = formedTeams[0].map(p => p.id)
      const team1Ids = formedTeams[1].map(p => p.id)
      const benchIds = remainingPlayers.map(p => p.id)
      
      // participants in team 0 should not be in team 1
      expect(team0Ids.every(id => !team1Ids.includes(id))).toBe(true)

      // participants in team 1 should not be in team 0
      expect(team1Ids.every(id => !team0Ids.includes(id))).toBe(true)

      // participants in team 0 should not be in remaining players
      expect(team0Ids.every(id => !benchIds.includes(id))).toBe(true)
      
      // participants in team 1 should not be in remaining players
      expect(team1Ids.every(id => !benchIds.includes(id))).toBe(true)

      // remaining players should not be in team 0
      expect(benchIds.every(id => !team0Ids.includes(id))).toBe(true)

      // remaining players should not be in team 1
      expect(benchIds.every(id => !team1Ids.includes(id))).toBe(true)
    })
  })

  describe('should not repeat players between teams in a new match', () => {
    test.for([
      [2, null], [2, 0], [2, 1],
      [3, null], [3, 0], [3, 1],
      [4, null], [4, 0], [4, 1],
      [5, null], [5, 0], [5, 1],
      [6, null], [6, 0], [6, 1],
      [7, null], [7, 0], [7, 1],
      [8, null], [8, 0], [8, 1],
      [9, null], [9, 0], [9, 1],
      [10, null], [10, 0], [10, 1],
      [11, null], [11, 0], [11, 1],
      [12, null], [12, 0], [12, 1],
      [13, null], [13, 0], [13, 1],
      [14, null], [14, 0], [14, 1],
      [15, null], [15, 0], [15, 1],
      [16, null], [16, 0], [16, 1],
      [17, null], [17, 0], [17, 1],
      [18, null], [18, 0], [18, 1]
    ])('with %i participants, keep team %i', ([numberOfParticipants, keepTeamId]) => {
      const participants = generateParticipants(numberOfParticipants)
      const prevMatch = calculateTeams({participants})
      const { formedTeams, remainingPlayers } = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId
      })

      const team0Ids = formedTeams[0].map(p => p.id)
      const team1Ids = formedTeams[1].map(p => p.id)
      const benchIds = remainingPlayers.map(p => p.id)
      
      // participants in team 0 should not be in team 1
      expect(team0Ids.every(id => !team1Ids.includes(id))).toBe(true)

      // participants in team 1 should not be in team 0
      expect(team1Ids.every(id => !team0Ids.includes(id))).toBe(true)

      // participants in team 0 should not be in remaining players
      expect(team0Ids.every(id => !benchIds.includes(id))).toBe(true)
      
      // participants in team 1 should not be in remaining players
      expect(team1Ids.every(id => !benchIds.includes(id))).toBe(true)

      // remaining players should not be in team 0
      expect(benchIds.every(id => !team0Ids.includes(id))).toBe(true)

      // remaining players should not be in team 1
      expect(benchIds.every(id => !team1Ids.includes(id))).toBe(true)
    })
  })

  describe('should always include all bench players in a new match', () => {
    test.for([
      [3, null], [3, 0], [3, 1],
      [5, null], [5, 0], [5, 1],
      [7, null], [7, 0], [7, 1],
      [9, null], [9, 0], [9, 1],
      [11, null], [11, 0], [11, 1],
      [13, null], [13, 0], [13, 1],
      [14, null], [14, 0], [14, 1],
      [15, null], [15, 0], [15, 1],
      [16, null], [16, 0], [16, 1],
      [17, null], [17, 0], [17, 1],
      [18, null], [18, 0], [18, 1],
    ])('with %i participants, keep team %i', ([numberOfParticipants, keepTeamId]) => {
      const participants = generateParticipants(numberOfParticipants)
      const prevMatch = calculateTeams({participants})
      const { formedTeams } = calculateTeams({
        participants,
        teams: prevMatch.formedTeams,
        benchPlayers: prevMatch.remainingPlayers,
        keepTeamId
      })

      // all bench players should be in the new match (max of players should be respected)
      const newMatchPlayerIds = formedTeams.flat().map(p => p.id)
      const benchPlayerIds = prevMatch.remainingPlayers.map(p => p.id)
      expect(newMatchPlayerIds).toEqual(expect.arrayContaining(benchPlayerIds));
    })
  })
})

const generateParticipants = (count: number): Participant[] => {
  // Base list of names
  const baseNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 
    'Ivan', 'Judy', 'Karl', 'Liam', 'Mia', 'Nina', 'Oscar', 'Paul', 'Quinn', 
    'Rita', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xander', 'Yara', 'Zane'
  ]
  
  // If we need more names than we have, append numbers to reuse names
  const result: Participant[] = []
  for (let i = 0; i < count; i++) {
    const baseName = baseNames[i % baseNames.length]
    const nameWithNumber = i >= baseNames.length ? `${baseName}${Math.floor(i / baseNames.length) + 1}` : baseName
    result.push({
      id: `player-${i}`,
      name: nameWithNumber,
      weight: 1,
    })
  }
  return result
}