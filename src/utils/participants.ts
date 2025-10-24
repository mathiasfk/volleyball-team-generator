import { Participant } from '@/lib/types'

/**
 * Converts an array of participant objects to an array of names
 * @param participants - Array of participant objects
 * @returns Array of participant names
 */
export const participantsToNames = (participants: Participant[]): string[] => {
  return participants.map((p) => p.nome)
}

/**
 * Converts an array of names to participant objects
 * @param names - Array of names
 * @param existingParticipants - Existing participants to preserve IDs
 * @returns Array of participant objects with IDs
 */
export const namesToParticipants = (
  names: string[],
  existingParticipants: Participant[] = []
): Participant[] => {
  return names.map((name) => {
    const existing = existingParticipants.find((p) => p.nome === name)
    return existing || { id: Date.now().toString() + Math.random(), nome: name }
  })
}

/**
 * Converts 2D array of participant objects to 2D array of names
 * @param teams - Array of teams (each team is an array of participants)
 * @returns Array of teams (each team is an array of names)
 */
export const teamsToNames = (teams: Participant[][]): string[][] => {
  return teams.map((team) => participantsToNames(team))
}

/**
 * Converts 2D array of names to 2D array of participant objects
 * @param teamNames - Array of teams (each team is an array of names)
 * @param existingParticipants - Existing participants to preserve IDs
 * @returns Array of teams (each team is an array of participants)
 */
export const namesToTeams = (
  teamNames: string[][],
  existingParticipants: Participant[] = []
): Participant[][] => {
  return teamNames.map((team) =>
    namesToParticipants(team, existingParticipants)
  )
}

/**
 * Finds a participant by name (case insensitive)
 * @param name - Name to search for
 * @param participants - Array of participants
 * @returns Participant object or undefined
 */
export const findParticipantByName = (
  name: string,
  participants: Participant[]
): Participant | undefined => {
  return participants.find(
    (p) => p.nome.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Creates a new participant object
 * @param name - Participant name
 * @returns New participant object with generated ID
 */
export const createParticipant = (name: string): Participant => {
  return {
    id: Date.now().toString() + Math.random(),
    nome: name,
  }
}


