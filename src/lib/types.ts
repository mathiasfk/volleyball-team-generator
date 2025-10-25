/**
 * Domain Entities
 */

/**
 * Represents a participant in the volleyball draw
 */
export interface Participant {
  id: string
  name: string
  /**
   * Experience weight for team balancing
   * - 0.5: Beginner (Iniciante)
   * - 1.0: Intermediate (Intermediário) - default
   * - 1.5: Advanced (Avançado)
   * 
   * When undefined, defaults to 1.0 (Intermediate)
   */
  weight?: number
}

