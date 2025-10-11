import { describe, expect, test } from 'vitest'
import { calculateTeams } from './calculateTeams'

describe('calculateTeams', () => {

  test.for([
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
  ])('should create two balanced teams > %i participants', (numberOfParticipants) => {
    const participants = generateParticipants(numberOfParticipants)
    const { formedTeams } = calculateTeams(participants)
    expect(formedTeams).toHaveLength(2)
    expect(formedTeams[0].length).toBeCloseTo(formedTeams[1].length, 1) // Teams should be balanced
    expect(formedTeams[0].length).toBe(formedTeams[1].length) // Teams should be balanced
  })

  test.for([
    [1, 1],
    [0, 2],
    [1, 3],
    [0, 4],
    [1, 7],
    [0, 12],
    [1, 13],
    [5, 17],
  ])('should leave %i people on the bench > % i participants', ([expectedBenchCount, numberOfParticipants]) => {
    const participants = generateParticipants(numberOfParticipants)
    const { remainingPlayers } = calculateTeams(participants)
    expect(remainingPlayers).toHaveLength(expectedBenchCount)
  })

  test.for([
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
  ])('should be no missing people > %i participants', (numberOfParticipants) => {
    const participants = generateParticipants(numberOfParticipants)
    const { formedTeams, remainingPlayers } = calculateTeams(participants)
    const peoplePlaying = formedTeams.flat().length
    const peopleOnBench = remainingPlayers.length
    expect(peoplePlaying + peopleOnBench).toBe(numberOfParticipants)
  })

  test.for([
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 36
  ])('should have at most 6 players per team > %i participants', (numberOfParticipants) => {
    const participants = generateParticipants(numberOfParticipants)
    const { formedTeams } = calculateTeams(participants)
    
    expect(formedTeams[0].length).toBeLessThanOrEqual(6)
    expect(formedTeams[1].length).toBeLessThanOrEqual(6)
    expect(formedTeams[0].length).toBeGreaterThanOrEqual(1)
    expect(formedTeams[1].length).toBeGreaterThanOrEqual(1)
  })
})

const generateParticipants = (count: number) => {
  // Base list of names
  const baseNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 
    'Ivan', 'Judy', 'Karl', 'Liam', 'Mia', 'Nina', 'Oscar', 'Paul', 'Quinn', 
    'Rita', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xander', 'Yara', 'Zane'
  ]
  
  // If we need more names than we have, append numbers to reuse names
  const result = []
  for (let i = 0; i < count; i++) {
    const baseName = baseNames[i % baseNames.length]
    const nameWithNumber = i >= baseNames.length ? `${baseName}${Math.floor(i / baseNames.length) + 1}` : baseName
    result.push(nameWithNumber)
  }
  return result
}