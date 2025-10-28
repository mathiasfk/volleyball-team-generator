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
  /**
   * Player position/role
   * - 'any': Can play any position (default)
   * - 'libero': Defensive specialist (max 1 per team)
   * 
   * When undefined, defaults to 'any'
   */
  role?: 'any' | 'libero'
  /**
   * Counter tracking how many games this player has participated in
   * Incremented each time the player is allocated to a team (not bench)
   * 
   * When undefined, defaults to 0
   */
  gamesPlayed?: number
}

