import { Participant } from '@/lib/types'

/**
 * Checks if a participant name is duplicated in the list
 * @param name - The name to check
 * @param participants - List of existing participants
 * @param idToExclude - Optional ID to exclude from the check (for edit operations)
 * @returns true if the name is a duplicate, false otherwise
 */
export const isDuplicateName = (
  name: string,
  participants: Participant[],
  idToExclude: string | null = null
): boolean => {
  return participants.some(
    (p) =>
      p.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      p.id !== idToExclude
  )
}

/**
 * Checks if a name is empty after trimming
 * @param name - The name to check
 * @returns true if the name is empty, false otherwise
 */
export const isEmptyName = (name: string): boolean => {
  return name.trim() === ''
}

/**
 * Formats a participant name by trimming whitespace
 * @param name - The name to format
 * @returns The formatted name
 */
export const formatParticipantName = (name: string): string => {
  return name.trim()
}


