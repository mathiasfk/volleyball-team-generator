/**
 * Domain Entities
 */

/**
 * Represents a participant in the volleyball draw
 */
export interface Participant {
  id: string
  name: string
  weight?: number // Optional experience level for team balancing
}

