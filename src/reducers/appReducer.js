// Action Types
export const ACTIONS = {
  SET_NEW_NAME: 'SET_NEW_NAME',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_PARTICIPANT: 'ADD_PARTICIPANT',
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  CLEAR_ALL_PARTICIPANTS: 'CLEAR_ALL_PARTICIPANTS',
  START_EDITING: 'START_EDITING',
  SET_EDITED_NAME: 'SET_EDITED_NAME',
  SAVE_EDIT: 'SAVE_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  SET_TEAMS: 'SET_TEAMS',
  CLEAR_DRAW: 'CLEAR_DRAW',
  TOGGLE_PARTICIPANTS: 'TOGGLE_PARTICIPANTS',
  SET_OPEN_CLEAR_DIALOG: 'SET_OPEN_CLEAR_DIALOG',
  SET_OPEN_DRAW_DIALOG: 'SET_OPEN_DRAW_DIALOG',
  LOAD_DATA: 'LOAD_DATA',
  SET_DATA_LOADED: 'SET_DATA_LOADED',
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
  openClearDialog: false,
  openDrawDialog: false,
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
    
    case ACTIONS.SET_TEAMS:
      return {
        ...state,
        teams: action.payload.teams,
        benchPlayers: action.payload.benchPlayers,
        error: '',
        openDrawDialog: false,
      }
    
    case ACTIONS.CLEAR_DRAW:
      return {
        ...state,
        teams: [],
        benchPlayers: [],
        error: '',
      }
    
    case ACTIONS.TOGGLE_PARTICIPANTS:
      return { ...state, openParticipants: !state.openParticipants }
    
    case ACTIONS.SET_OPEN_CLEAR_DIALOG:
      return { ...state, openClearDialog: action.payload }
    
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
    
    default:
      return state
  }
}

