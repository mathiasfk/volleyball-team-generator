const EXAMPLE_NAMES = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Emir']

// A marker, rather than the visible name, distinguishes examples from real players.
export function createExampleParticipants() {
  const baseTime = Date.now()
  return EXAMPLE_NAMES.map((name, index) => ({
    id: `${baseTime}-${index + 1}`,
    name,
    weight: 1,
    role: 'any',
    isExample: true,
  }))
}
