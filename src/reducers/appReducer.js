// Action Types
export const ACTIONS = {
  SET_NEW_NAME: 'SET_NEW_NAME',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_PARTICIPANT: 'ADD_PARTICIPANT',
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  CLEAR_ALL_PARTICIPANTS: 'CLEAR_ALL_PARTICIPANTS',
  UPDATE_PARTICIPANT: 'UPDATE_PARTICIPANT',
  START_EDITING: 'START_EDITING',
  SET_EDITED_NAME: 'SET_EDITED_NAME',
  SAVE_EDIT: 'SAVE_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  SET_TEAMS: 'SET_TEAMS',
  CLEAR_DRAW: 'CLEAR_DRAW',
  TOGGLE_PARTICIPANTS: 'TOGGLE_PARTICIPANTS',
  SET_OPEN_DRAW_DIALOG: 'SET_OPEN_DRAW_DIALOG',
  LOAD_DATA: 'LOAD_DATA',
  SET_DATA_LOADED: 'SET_DATA_LOADED',
  CLEAR_CHANGED_PLAYERS: 'CLEAR_CHANGED_PLAYERS',
}

// Estado inicial
export const initialState = {
  participants: [],
  newName: '',
  editingId: null,
  editedName: '',
  teams: [],
  benchPlayers: [],
  error: '',
  dataLoaded: false,
  openParticipants: true,
  openDrawDialog: false,
  changedPlayerIds: [], // Array of player IDs that changed position
  previousPlayerPositions: null, // Map of player positions before last draw (not serializable, reset on page load)
}

// Reducer function
export function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_NEW_NAME:
      return { ...state, newName: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: '' }
    
    case ACTIONS.ADD_PARTICIPANT:
      return {
        ...state,
        participants: [...state.participants, action.payload],
        newName: '',
        error: '',
      }
    
    case ACTIONS.REMOVE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload),
        error: '',
      }
    
    case ACTIONS.CLEAR_ALL_PARTICIPANTS:
      return {
        ...state,
        participants: [],
        teams: [],
        benchPlayers: [],
        error: '',
      }
    
    case ACTIONS.START_EDITING:
      return {
        ...state,
        editingId: action.payload.id,
        editedName: action.payload.name,
        error: '',
      }
    
    case ACTIONS.SET_EDITED_NAME:
      return { ...state, editedName: action.payload }
    
    case ACTIONS.SAVE_EDIT:
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
        editingId: null,
        editedName: '',
        error: '',
      }
    
    case ACTIONS.CANCEL_EDIT:
      return {
        ...state,
        editingId: null,
        editedName: '',
        error: '',
      }
    
    case ACTIONS.UPDATE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.payload.id 
            ? { ...p, ...action.payload } 
            : p
        ),
        error: '',
      }
    
    case ACTIONS.SET_TEAMS: {
      // Create a set of player IDs that are in teams (not on bench)
      const playersInTeams = new Set()
      action.payload.teams.forEach(team => {
        team.forEach(player => playersInTeams.add(player.id))
      })
      
      // Update participants with incremented gamesPlayed
      const updatedParticipants = state.participants.map(p => 
        playersInTeams.has(p.id)
          ? { ...p, gamesPlayed: (p.gamesPlayed || 0) + 1 }
          : p
      )
      
      // Create a map for quick lookup of updated participants
      const participantMap = new Map(updatedParticipants.map(p => [p.id, p]))
      
      // Update teams with the updated participant references
      const updatedTeams = action.payload.teams.map(team =>
        team.map(player => participantMap.get(player.id) || player)
      )
      
      // Update bench players with the updated participant references
      const updatedBenchPlayers = action.payload.benchPlayers.map(player =>
        participantMap.get(player.id) || player
      )
      
      return {
        ...state,
        participants: updatedParticipants,
        teams: updatedTeams,
        benchPlayers: updatedBenchPlayers,
        changedPlayerIds: action.payload.changedPlayerIds || [],
        previousPlayerPositions: action.payload.newPlayerPositions || null,
        error: '',
        openDrawDialog: false,
      }
    }
    
    case ACTIONS.CLEAR_DRAW:
      return {
        ...state,
        participants: state.participants.map(p => ({
          ...p,
          gamesPlayed: 0
        })),
        teams: [],
        benchPlayers: [],
        changedPlayerIds: [],
        previousPlayerPositions: null,
        error: '',
      }
    
    case ACTIONS.TOGGLE_PARTICIPANTS:
      return { ...state, openParticipants: !state.openParticipants }
    
    case ACTIONS.SET_OPEN_DRAW_DIALOG:
      return { ...state, openDrawDialog: action.payload }
    
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        participants: action.payload.participants || state.participants,
        teams: action.payload.teams || state.teams,
        benchPlayers: action.payload.benchPlayers || state.benchPlayers,
      }
    
    case ACTIONS.SET_DATA_LOADED:
      return { ...state, dataLoaded: true }
    
    case ACTIONS.CLEAR_CHANGED_PLAYERS:
      return { ...state, changedPlayerIds: [] }
    
    default:
      return state
  }
}

