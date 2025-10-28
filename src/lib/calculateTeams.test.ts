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

  describe('Libero role constraint', () => {
    test('should not assign more than one libero per team', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Libero3', weight: 1, role: 'libero' },
        { id: '4', name: 'Libero4', weight: 1, role: 'libero' },
        { id: '5', name: 'Player1', weight: 1, role: 'any' },
        { id: '6', name: 'Player2', weight: 1, role: 'any' },
        { id: '7', name: 'Player3', weight: 1, role: 'any' },
        { id: '8', name: 'Player4', weight: 1, role: 'any' },
        { id: '9', name: 'Player5', weight: 1, role: 'any' },
        { id: '10', name: 'Player6', weight: 1, role: 'any' },
        { id: '11', name: 'Player7', weight: 1, role: 'any' },
        { id: '12', name: 'Player8', weight: 1, role: 'any' },
      ]

      const { formedTeams, remainingPlayers } = calculateTeams({ participants })

      // Count liberos in each team
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')
      const benchLiberos = remainingPlayers.filter(p => p.role === 'libero')

      // Each team should have at most 1 libero
      expect(team0Liberos.length).toBeLessThanOrEqual(1)
      expect(team1Liberos.length).toBeLessThanOrEqual(1)

      // Extra liberos should be on bench (we have 4 liberos, only 2 can play)
      expect(benchLiberos.length).toBeGreaterThanOrEqual(2)
    })

    test('should distribute teams correctly when there is only 1 libero', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Player1', weight: 1, role: 'any' },
        { id: '3', name: 'Player2', weight: 1, role: 'any' },
        { id: '4', name: 'Player3', weight: 1, role: 'any' },
        { id: '5', name: 'Player4', weight: 1, role: 'any' },
        { id: '6', name: 'Player5', weight: 1, role: 'any' },
        { id: '7', name: 'Player6', weight: 1, role: 'any' },
        { id: '8', name: 'Player7', weight: 1, role: 'any' },
        { id: '9', name: 'Player8', weight: 1, role: 'any' },
        { id: '10', name: 'Player9', weight: 1, role: 'any' },
        { id: '11', name: 'Player10', weight: 1, role: 'any' },
        { id: '12', name: 'Player11', weight: 1, role: 'any' },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Count liberos in each team
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')

      // Only one team should have the libero
      const totalLiberos = team0Liberos.length + team1Liberos.length
      expect(totalLiberos).toBe(1)

      // Teams should still be balanced
      expect(formedTeams[0].length).toBe(6)
      expect(formedTeams[1].length).toBe(6)
    })

    test('should handle teams with no liberos', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1, role: 'any' },
        { id: '2', name: 'Player2', weight: 1, role: 'any' },
        { id: '3', name: 'Player3', weight: 1, role: 'any' },
        { id: '4', name: 'Player4', weight: 1, role: 'any' },
        { id: '5', name: 'Player5', weight: 1, role: 'any' },
        { id: '6', name: 'Player6', weight: 1, role: 'any' },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Count liberos in each team (should be 0)
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')

      expect(team0Liberos.length).toBe(0)
      expect(team1Liberos.length).toBe(0)

      // Teams should still be balanced
      expect(formedTeams[0].length).toBe(3)
      expect(formedTeams[1].length).toBe(3)
    })

    test('should handle participants without role defined (defaults to any)', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1 }, // No role defined
        { id: '2', name: 'Player2', weight: 1 }, // No role defined
        { id: '3', name: 'Player3', weight: 1, role: 'any' },
        { id: '4', name: 'Player4', weight: 1, role: 'any' },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Should work fine, no liberos
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')

      expect(team0Liberos.length).toBe(0)
      expect(team1Liberos.length).toBe(0)
      expect(formedTeams[0].length).toBe(2)
      expect(formedTeams[1].length).toBe(2)
    })

    test('should respect libero constraint when keeping a team with a libero', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Player1', weight: 1, role: 'any' },
        { id: '4', name: 'Player2', weight: 1, role: 'any' },
        { id: '5', name: 'Player3', weight: 1, role: 'any' },
        { id: '6', name: 'Player4', weight: 1, role: 'any' },
        { id: '7', name: 'Player5', weight: 1, role: 'any' },
        { id: '8', name: 'Player6', weight: 1, role: 'any' },
        { id: '9', name: 'Player7', weight: 1, role: 'any' },
        { id: '10', name: 'Player8', weight: 1, role: 'any' },
      ]

      // First match
      const firstMatch = calculateTeams({ participants })
      
      // Ensure at least one team has a libero
      const team0HasLibero = firstMatch.formedTeams[0].some(p => p.role === 'libero')
      const team1HasLibero = firstMatch.formedTeams[1].some(p => p.role === 'libero')
      expect(team0HasLibero || team1HasLibero).toBe(true)

      // Keep the team with the libero
      const keepTeamId = team0HasLibero ? 0 : 1

      // Second match - keep team with libero, add new libero to bench
      const newMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
        keepTeamId,
      })

      // Count liberos in each team
      const newTeam0Liberos = newMatch.formedTeams[0].filter(p => p.role === 'libero')
      const newTeam1Liberos = newMatch.formedTeams[1].filter(p => p.role === 'libero')

      // Each team should have at most 1 libero
      expect(newTeam0Liberos.length).toBeLessThanOrEqual(1)
      expect(newTeam1Liberos.length).toBeLessThanOrEqual(1)

      // The kept team should still have its original libero (if it had one)
      if (keepTeamId === 0 && team0HasLibero) {
        expect(newTeam0Liberos.length).toBe(1)
      } else if (keepTeamId === 1 && team1HasLibero) {
        expect(newTeam1Liberos.length).toBe(1)
      }
    })

    test('should respect libero constraint when keeping a team without a libero', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Player1', weight: 1, role: 'any' },
        { id: '4', name: 'Player2', weight: 1, role: 'any' },
        { id: '5', name: 'Player3', weight: 1, role: 'any' },
        { id: '6', name: 'Player4', weight: 1, role: 'any' },
        { id: '7', name: 'Player5', weight: 1, role: 'any' },
        { id: '8', name: 'Player6', weight: 1, role: 'any' },
        { id: '9', name: 'Player7', weight: 1, role: 'any' },
        { id: '10', name: 'Player8', weight: 1, role: 'any' },
      ]

      // First match
      const firstMatch = calculateTeams({ participants })
      
      // Find the team without a libero (or with if both have)
      const team0HasLibero = firstMatch.formedTeams[0].some(p => p.role === 'libero')
      
      // Keep a team (preferably one without libero, but either works for this test)
      const keepTeamId = !team0HasLibero ? 0 : 1

      // Second match
      const newMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
        keepTeamId,
      })

      // Count liberos in each team
      const newTeam0Liberos = newMatch.formedTeams[0].filter(p => p.role === 'libero')
      const newTeam1Liberos = newMatch.formedTeams[1].filter(p => p.role === 'libero')

      // Each team should have at most 1 libero
      expect(newTeam0Liberos.length).toBeLessThanOrEqual(1)
      expect(newTeam1Liberos.length).toBeLessThanOrEqual(1)
    })

    test('should prioritize bench liberos for redistribution', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Libero3', weight: 1, role: 'libero' },
        { id: '4', name: 'Player1', weight: 1, role: 'any' },
        { id: '5', name: 'Player2', weight: 1, role: 'any' },
        { id: '6', name: 'Player3', weight: 1, role: 'any' },
        { id: '7', name: 'Player4', weight: 1, role: 'any' },
        { id: '8', name: 'Player5', weight: 1, role: 'any' },
        { id: '9', name: 'Player6', weight: 1, role: 'any' },
        { id: '10', name: 'Player7', weight: 1, role: 'any' },
        { id: '11', name: 'Player8', weight: 1, role: 'any' },
        { id: '12', name: 'Player9', weight: 1, role: 'any' },
        { id: '13', name: 'Player10', weight: 1, role: 'any' },
      ]

      // First match - 3 liberos, only 2 can play, 1 goes to bench
      const firstMatch = calculateTeams({ participants })
      
      const benchLiberos = firstMatch.remainingPlayers.filter(p => p.role === 'libero')
      expect(benchLiberos.length).toBeGreaterThanOrEqual(1)

      // Second match - bench players should be prioritized
      const secondMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
      })

      // All bench players from first match should be playing in second match
      const secondMatchPlayerIds = secondMatch.formedTeams.flat().map(p => p.id)
      const firstBenchIds = firstMatch.remainingPlayers.map(p => p.id)
      
      // Bench players should be included in the new match
      expect(secondMatchPlayerIds).toEqual(expect.arrayContaining(firstBenchIds))

      // Still respect libero constraint
      const team0Liberos = secondMatch.formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = secondMatch.formedTeams[1].filter(p => p.role === 'libero')
      expect(team0Liberos.length).toBeLessThanOrEqual(1)
      expect(team1Liberos.length).toBeLessThanOrEqual(1)
    })

    test('should balance teams considering libero constraint with mixed weights', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1.5, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Advanced1', weight: 1.5, role: 'any' },
        { id: '4', name: 'Advanced2', weight: 1.5, role: 'any' },
        { id: '5', name: 'Intermediate1', weight: 1, role: 'any' },
        { id: '6', name: 'Intermediate2', weight: 1, role: 'any' },
        { id: '7', name: 'Beginner1', weight: 0.5, role: 'any' },
        { id: '8', name: 'Beginner2', weight: 0.5, role: 'any' },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Count liberos in each team
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')

      // Each team should have at most 1 libero
      expect(team0Liberos.length).toBeLessThanOrEqual(1)
      expect(team1Liberos.length).toBeLessThanOrEqual(1)

      // Teams should be balanced in weight
      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)
      const difference = Math.abs(team0Weight - team1Weight)
      
      // Allow reasonable difference given libero constraint
      expect(difference).toBeLessThanOrEqual(1.5)
    })

    test('should handle edge case with many liberos and few regular players', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Libero1', weight: 1, role: 'libero' },
        { id: '2', name: 'Libero2', weight: 1, role: 'libero' },
        { id: '3', name: 'Libero3', weight: 1, role: 'libero' },
        { id: '4', name: 'Libero4', weight: 1, role: 'libero' },
        { id: '5', name: 'Libero5', weight: 1, role: 'libero' },
        { id: '6', name: 'Player1', weight: 1, role: 'any' },
        { id: '7', name: 'Player2', weight: 1, role: 'any' },
      ]

      const { formedTeams, remainingPlayers } = calculateTeams({ participants })

      // Count liberos in teams
      const team0Liberos = formedTeams[0].filter(p => p.role === 'libero')
      const team1Liberos = formedTeams[1].filter(p => p.role === 'libero')
      const benchLiberos = remainingPlayers.filter(p => p.role === 'libero')

      // Each team should have at most 1 libero
      expect(team0Liberos.length).toBeLessThanOrEqual(1)
      expect(team1Liberos.length).toBeLessThanOrEqual(1)

      // At least 3 liberos should be on bench (5 total - max 2 playing)
      expect(benchLiberos.length).toBeGreaterThanOrEqual(3)

      // All players should be accounted for
      const totalPlayers = formedTeams[0].length + formedTeams[1].length + remainingPlayers.length
      expect(totalPlayers).toBe(7)
    })
  })

  describe('Game participation counter - prioritizing players with fewer games', () => {
    test('should prioritize players with fewer games played', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1, gamesPlayed: 10 },
        { id: '2', name: 'Player2', weight: 1, gamesPlayed: 10 },
        { id: '3', name: 'Player3', weight: 1, gamesPlayed: 10 },
        { id: '4', name: 'Player4', weight: 1, gamesPlayed: 5 },
        { id: '5', name: 'Player5', weight: 1, gamesPlayed: 5 },
        { id: '6', name: 'Player6', weight: 1, gamesPlayed: 5 },
        { id: '7', name: 'Player7', weight: 1, gamesPlayed: 0 },
        { id: '8', name: 'Player8', weight: 1, gamesPlayed: 0 },
      ]

      const { formedTeams, remainingPlayers } = calculateTeams({ participants })

      // Players with 0 games should all be playing
      const playingIds = formedTeams.flat().map(p => p.id)
      expect(playingIds).toContain('7')
      expect(playingIds).toContain('8')

      // Calculate average games played for playing vs bench
      const playingPlayers = formedTeams.flat()
      const avgGamesPlaying = playingPlayers.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) / playingPlayers.length
      const avgGamesBench = remainingPlayers.length > 0
        ? remainingPlayers.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) / remainingPlayers.length
        : 0

      // Players who are playing should have fewer average games than bench
      // (or bench is empty)
      if (remainingPlayers.length > 0) {
        expect(avgGamesPlaying).toBeLessThanOrEqual(avgGamesBench)
      }
    })

    test('should handle participants without gamesPlayed (defaults to 0)', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1 }, // No gamesPlayed
        { id: '2', name: 'Player2', weight: 1, gamesPlayed: 5 },
        { id: '3', name: 'Player3', weight: 1 }, // No gamesPlayed
        { id: '4', name: 'Player4', weight: 1, gamesPlayed: 3 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      const playingIds = formedTeams.flat().map(p => p.id)
      
      // Players without gamesPlayed (treated as 0) should be prioritized
      expect(playingIds).toContain('1')
      expect(playingIds).toContain('3')
    })

    test('should still respect bench player priority over games played', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1, gamesPlayed: 0 },
        { id: '2', name: 'Player2', weight: 1, gamesPlayed: 0 },
        { id: '3', name: 'Player3', weight: 1, gamesPlayed: 10 },
        { id: '4', name: 'Player4', weight: 1, gamesPlayed: 10 },
        { id: '5', name: 'Player5', weight: 1, gamesPlayed: 5 },
        { id: '6', name: 'Player6', weight: 1, gamesPlayed: 5 },
        { id: '7', name: 'Player7', weight: 1, gamesPlayed: 5 },
      ]

      const firstMatch = calculateTeams({ participants })
      
      // Second match - bench players should play regardless of their games count
      const benchPlayers = firstMatch.remainingPlayers
      const secondMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers,
      })

      // All bench players should be playing in second match
      const secondMatchPlayerIds = secondMatch.formedTeams.flat().map(p => p.id)
      const benchPlayerIds = benchPlayers.map(p => p.id)
      
      expect(secondMatchPlayerIds).toEqual(expect.arrayContaining(benchPlayerIds))
    })

    test('should balance teams while considering games played', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Advanced1', weight: 1.5, gamesPlayed: 10 },
        { id: '2', name: 'Advanced2', weight: 1.5, gamesPlayed: 0 },
        { id: '3', name: 'Intermediate1', weight: 1, gamesPlayed: 5 },
        { id: '4', name: 'Intermediate2', weight: 1, gamesPlayed: 5 },
        { id: '5', name: 'Beginner1', weight: 0.5, gamesPlayed: 10 },
        { id: '6', name: 'Beginner2', weight: 0.5, gamesPlayed: 0 },
      ]

      const { formedTeams } = calculateTeams({ participants })

      // Players with fewer games should be prioritized
      const playingIds = formedTeams.flat().map(p => p.id)
      expect(playingIds).toContain('2') // Advanced with 0 games
      expect(playingIds).toContain('6') // Beginner with 0 games

      // Teams should still be reasonably balanced by weight
      const team0Weight = formedTeams[0].reduce((sum, p) => sum + (p.weight || 1), 0)
      const team1Weight = formedTeams[1].reduce((sum, p) => sum + (p.weight || 1), 0)
      const difference = Math.abs(team0Weight - team1Weight)
      
      // Allow reasonable difference
      expect(difference).toBeLessThanOrEqual(1)
    })

    test('should prioritize by games played when keeping one team', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1, gamesPlayed: 10 },
        { id: '2', name: 'Player2', weight: 1, gamesPlayed: 10 },
        { id: '3', name: 'Player3', weight: 1, gamesPlayed: 10 },
        { id: '4', name: 'Player4', weight: 1, gamesPlayed: 2 },
        { id: '5', name: 'Player5', weight: 1, gamesPlayed: 2 },
        { id: '6', name: 'Player6', weight: 1, gamesPlayed: 2 },
        { id: '7', name: 'Player7', weight: 1, gamesPlayed: 0 },
        { id: '8', name: 'Player8', weight: 1, gamesPlayed: 0 },
      ]

      const firstMatch = calculateTeams({ participants })
      
      // Keep team 0 and redistribute team 1
      const secondMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
        keepTeamId: 0,
      })

      // Team 0 should be kept intact
      const team0Ids = secondMatch.formedTeams[0].map(p => p.id)
      const firstTeam0Ids = firstMatch.formedTeams[0].map(p => p.id)
      expect(team0Ids).toEqual(firstTeam0Ids)

      // Team 1 should prioritize players with fewer games (unless they're bench players)
      const team1 = secondMatch.formedTeams[1]
      
      // Players with 0 games should be highly likely to play (unless on bench requires more)
      const hasLowGamePlayers = team1.some(p => (p.gamesPlayed || 0) <= 2)
      expect(hasLowGamePlayers).toBe(true)
    })

    test('should prioritize players with fewest games over players with more games when keeping one team', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Player1', weight: 1, gamesPlayed: 0, role: 'libero' },
        { id: '2', name: 'Player2', weight: 1, gamesPlayed: 0, role: 'libero' },
        { id: '3', name: 'Player3', weight: 1, gamesPlayed: 10 },
        { id: '4', name: 'Player4', weight: 1, gamesPlayed: 2 },
        { id: '5', name: 'Player5', weight: 1, gamesPlayed: 2 },
        { id: '6', name: 'Player6', weight: 1, gamesPlayed: 2 },
        { id: '7', name: 'Player7', weight: 1, gamesPlayed: 2 },
        { id: '8', name: 'Player8', weight: 1, gamesPlayed: 2 },
        { id: '9', name: 'Player9', weight: 1, gamesPlayed: 2 },
        { id: '10', name: 'Player10', weight: 1, gamesPlayed: 2 },
        { id: '11', name: 'Player11', weight: 1, gamesPlayed: 2 },
        { id: '12', name: 'Player12', weight: 1, gamesPlayed: 2 },
        { id: '13', name: 'Player13', weight: 1, gamesPlayed: 2 },
        { id: '14', name: 'Player14', weight: 1, gamesPlayed: 2 },
        { id: '15', name: 'Player15', weight: 1, gamesPlayed: 2 }
        ]

      const firstMatch = calculateTeams({ participants })
      const secondMatch = calculateTeams({
        participants,
        teams: firstMatch.formedTeams,
        benchPlayers: firstMatch.remainingPlayers,
        keepTeamId: 0,
      })

      // expect participants with fewest games to be playing
      const playingIds = secondMatch.formedTeams.flat().map(p => p.id)
      const playersWithFewestGames = participants.sort((a, b) => (a.gamesPlayed || 0) - (b.gamesPlayed || 0)).slice(0, 2)
      expect(playersWithFewestGames.every(p => playingIds.includes(p.id))).toBe(true)

      // expect participants on bench to have more games than players with fewest games
      const playersOnBench = secondMatch.remainingPlayers.sort((a, b) => (a.gamesPlayed || 0) - (b.gamesPlayed || 0)).slice(0, 2)
      expect(playersOnBench.every(p => p.gamesPlayed || 0 > playersWithFewestGames[0].gamesPlayed || 0)).toBe(true)
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
})