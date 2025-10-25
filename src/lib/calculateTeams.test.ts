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

  describe('should balance teams by experience weight', () => {
    test('should create balanced teams with different skill levels', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Beginner1', weight: 0.5 },
        { id: '2', name: 'Beginner2', weight: 0.5 },
        { id: '3', name: 'Intermediate1', weight: 1 },
        { id: '4', name: 'Intermediate2', weight: 1 },
        { id: '5', name: 'Advanced1', weight: 1.5 }, 
        { id: '6', name: 'Advanced2', weight: 1.5 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // Teams should have equal total weight (both should be 3.0)
      expect(team0Weight).toBe(team1Weight)
      expect(team0Weight).toBe(3)
    })

    test('should balance teams with mixed skill levels - scenario 1', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Beginner1', weight: 0.5 },
        { id: '2', name: 'Beginner2', weight: 0.5 },
        { id: '3', name: 'Intermediate1', weight: 1 },
        { id: '4', name: 'Intermediate2', weight: 1 },
        { id: '5', name: 'Intermediate3', weight: 1 },
        { id: '6', name: 'Intermediate4', weight: 1 },
        { id: '7', name: 'Advanced1', weight: 1.5 },
        { id: '8', name: 'Advanced2', weight: 1.5 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // Total weight is 8, so each team should have 4
      expect(team0Weight).toBe(4)
      expect(team1Weight).toBe(4)
    })

    test('should balance teams as close as possible when perfect balance is impossible', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Beginner', weight: 0.5 },
        { id: '2', name: 'Intermediate1', weight: 1 },
        { id: '3', name: 'Intermediate2', weight: 1 },
        { id: '4', name: 'Advanced', weight: 1.5 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // Total weight is 4, ideal is 2 per team
      // Best possible: 2.0 vs 2.0 or close difference
      const difference = Math.abs(team0Weight - team1Weight)
      expect(difference).toBeLessThanOrEqual(0.5)
    })

    test('should handle participants without weight (default to 1)', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1' }, // No weight, should default to 1
        { id: '2', name: 'Player2', weight: 1 },
        { id: '3', name: 'Player3' }, // No weight, should default to 1
        { id: '4', name: 'Player4', weight: 1 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // All players effectively have weight 1, so teams should be 2 vs 2
      expect(team0Weight).toBe(2)
      expect(team1Weight).toBe(2)
    })

    test('should balance teams with larger groups', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Beginner1', weight: 0.5 },
        { id: '2', name: 'Beginner2', weight: 0.5 },
        { id: '3', name: 'Beginner3', weight: 0.5 },
        { id: '4', name: 'Beginner4', weight: 0.5 },
        { id: '5', name: 'Intermediate1', weight: 1 },
        { id: '6', name: 'Intermediate2', weight: 1 },
        { id: '7', name: 'Intermediate3', weight: 1 },
        { id: '8', name: 'Intermediate4', weight: 1 },
        { id: '9', name: 'Advanced1', weight: 1.5 },
        { id: '10', name: 'Advanced2', weight: 1.5 },
        { id: '11', name: 'Advanced3', weight: 1.5 },
        { id: '12', name: 'Advanced4', weight: 1.5 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // Total weight is 12, so each team should have 6
      expect(team0Weight).toBe(6)
      expect(team1Weight).toBe(6)
    })

    test('should maintain balance when keeping one team', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Beginner1', weight: 0.5 },
        { id: '2', name: 'Beginner2', weight: 0.5 },
        { id: '3', name: 'Intermediate1', weight: 1 },
        { id: '4', name: 'Intermediate2', weight: 1 },
        { id: '5', name: 'Advanced1', weight: 1.5 },
        { id: '6', name: 'Advanced2', weight: 1.5 },
        { id: '7', name: 'Intermediate3', weight: 1 },
        { id: '8', name: 'Intermediate4', weight: 1 },
      ]

      const firstMatch = calculateTeams({ participants })
      const { formedTeams } = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
        keepTeamId: 0,
      })

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)

      // The other team should be balanced against the kept team as much as possible
      const difference = Math.abs(team0Weight - team1Weight)
      expect(difference).toBeLessThanOrEqual(1.5) // Allow some tolerance
    })

    test('should create best possible balance with 12 participants when perfect balance is impossible', () => {
      // Scenario: 12 players with uneven weight distribution
      // Total weight: 11.5, so each team should ideally have 5.75
      // Since we can't split perfectly, algorithm should minimize difference
      const participants: Participant[] = [
        { id: '1', name: 'Advanced1', weight: 1.5 },
        { id: '2', name: 'Advanced2', weight: 1.5 },
        { id: '3', name: 'Advanced3', weight: 1.5 },
        { id: '4', name: 'Intermediate1', weight: 1 },
        { id: '5', name: 'Intermediate2', weight: 1 },
        { id: '6', name: 'Intermediate3', weight: 1 },
        { id: '7', name: 'Intermediate4', weight: 1 },
        { id: '8', name: 'Intermediate5', weight: 1 },
        { id: '9', name: 'Beginner1', weight: 0.5 },
        { id: '10', name: 'Beginner2', weight: 0.5 },
        { id: '11', name: 'Beginner3', weight: 0.5 },
        { id: '12', name: 'Beginner4', weight: 0.5 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Verify both teams have 6 players
      expect(formedTeams[0].length).toBe(6)
      expect(formedTeams[1].length).toBe(6)

      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)
      const totalWeight = team0Weight + team1Weight

      // Total weight should be 11.5
      expect(totalWeight).toBe(11.5)

      // With this distribution, perfect balance (5.75 each) is impossible
      // Algorithm should minimize the difference
      const difference = Math.abs(team0Weight - team1Weight)
      
      // The difference should be minimal (best possible balance)
      expect(difference).toBeLessThanOrEqual(0.5)

      // Both teams should be relatively close to the ideal weight
      expect(team0Weight).toBeGreaterThanOrEqual(5.5)
      expect(team0Weight).toBeLessThanOrEqual(6)
      expect(team1Weight).toBeGreaterThanOrEqual(5.5)
      expect(team1Weight).toBeLessThanOrEqual(6)
    })

    test('should create best possible balance with 15 participants leaving some on bench when perfect balance is impossible', () => {
      // Scenario: 15 players with uneven weight distribution
      // 12 will play (6 per team), 3 will be on bench
      // Total weight of all 15: 14.5 (4×1.5 + 6×1.0 + 5×0.5)
      const participants: Participant[] = [
        { id: '1', name: 'Advanced1', weight: 1.5 },
        { id: '2', name: 'Advanced2', weight: 1.5 },
        { id: '3', name: 'Advanced3', weight: 1.5 },
        { id: '4', name: 'Advanced4', weight: 1.5 },
        { id: '5', name: 'Intermediate1', weight: 1 },
        { id: '6', name: 'Intermediate2', weight: 1 },
        { id: '7', name: 'Intermediate3', weight: 1 },
        { id: '8', name: 'Intermediate4', weight: 1 },
        { id: '9', name: 'Intermediate5', weight: 1 },
        { id: '10', name: 'Intermediate6', weight: 1 },
        { id: '11', name: 'Beginner1', weight: 0.5 },
        { id: '12', name: 'Beginner2', weight: 0.5 },
        { id: '13', name: 'Beginner3', weight: 0.5 },
        { id: '14', name: 'Beginner4', weight: 0.5 },
        { id: '15', name: 'Beginner5', weight: 0.5 },
      ]

      const { formedTeams, remainingPlayers } = calculateTeams({ participants })

      // Verify team sizes
      expect(formedTeams[0].length).toBe(6)
      expect(formedTeams[1].length).toBe(6)
      expect(remainingPlayers.length).toBe(3)

      // Verify all players are accounted for
      const allPlayerIds = [
        ...formedTeams[0].map(p => p.id),
        ...formedTeams[1].map(p => p.id),
        ...remainingPlayers.map(p => p.id),
      ].sort()
      const originalIds = participants.map(p => p.id).sort()
      expect(allPlayerIds).toEqual(originalIds)

      // Calculate weights
      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)
      const benchWeight = remainingPlayers.reduce((sum, p) => sum + (p.weight || 1), 0)
      const totalWeight = team0Weight + team1Weight + benchWeight

      // Total weight should be 14.5
      expect(totalWeight).toBe(14.5)

      // Teams should be relatively balanced despite uneven distribution
      const difference = Math.abs(team0Weight - team1Weight)
      
      // The difference should be minimal (best possible balance)
      expect(difference).toBeLessThanOrEqual(1)

      // Both teams should have reasonable weights
      // The 12 playing spots have total weight that varies based on who's on bench
      // But each team should be relatively balanced
      expect(team0Weight).toBeGreaterThanOrEqual(4.5)
      expect(team0Weight).toBeLessThanOrEqual(7.5)
      expect(team1Weight).toBeGreaterThanOrEqual(4.5)
      expect(team1Weight).toBeLessThanOrEqual(7.5)
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