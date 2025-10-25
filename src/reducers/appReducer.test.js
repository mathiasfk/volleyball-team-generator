import { describe, expect,it } from 'vitest'

import { ACTIONS,appReducer, initialState } from './appReducer'

describe('appReducer', () => {
  describe('initialState', () => {
    it('should have correct initial state', () => {
      expect(initialState).toEqual({
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
      })
    })
  })

  describe('SET_NEW_NAME', () => {
    it('should update newName', () => {
      const action = { type: ACTIONS.SET_NEW_NAME, payload: 'João' }
      const newState = appReducer(initialState, action)
      
      expect(newState.newName).toBe('João')
      expect(newState).not.toBe(initialState) // Should return new object
    })

    it('should not mutate other state properties', () => {
      const state = { ...initialState, participants: [{ id: '1', name: 'Maria' }] }
      const action = { type: ACTIONS.SET_NEW_NAME, payload: 'João' }
      const newState = appReducer(state, action)
      
      expect(newState.participants).toEqual([{ id: '1', name: 'Maria' }])
    })
  })

  describe('SET_ERROR', () => {
    it('should set error message', () => {
      const action = { type: ACTIONS.SET_ERROR, payload: 'Nome duplicado' }
      const newState = appReducer(initialState, action)
      
      expect(newState.error).toBe('Nome duplicado')
    })
  })

  describe('CLEAR_ERROR', () => {
    it('should clear error message', () => {
      const state = { ...initialState, error: 'Some error' }
      const action = { type: ACTIONS.CLEAR_ERROR }
      const newState = appReducer(state, action)
      
      expect(newState.error).toBe('')
    })
  })

  describe('ADD_PARTICIPANT', () => {
    it('should add participant to list', () => {
      const participant = { id: '1', name: 'João' }
      const action = { type: ACTIONS.ADD_PARTICIPANT, payload: participant }
      const newState = appReducer(initialState, action)
      
      expect(newState.participants).toHaveLength(1)
      expect(newState.participants[0]).toEqual(participant)
    })

    it('should clear newName and error when adding participant', () => {
      const state = { ...initialState, newName: 'João', error: 'Some error' }
      const participant = { id: '1', name: 'João' }
      const action = { type: ACTIONS.ADD_PARTICIPANT, payload: participant }
      const newState = appReducer(state, action)
      
      expect(newState.newName).toBe('')
      expect(newState.error).toBe('')
    })

    it('should not mutate existing participants array', () => {
      const existingParticipants = [{ id: '1', name: 'Maria' }]
      const state = { ...initialState, participants: existingParticipants }
      const participant = { id: '2', name: 'João' }
      const action = { type: ACTIONS.ADD_PARTICIPANT, payload: participant }
      const newState = appReducer(state, action)
      
      expect(newState.participants).not.toBe(existingParticipants)
      expect(newState.participants).toHaveLength(2)
      expect(newState.participants).toContainEqual({ id: '1', name: 'Maria' })
      expect(newState.participants).toContainEqual({ id: '2', name: 'João' })
    })
  })

  describe('REMOVE_PARTICIPANT', () => {
    it('should remove participant by id', () => {
      const participants = [
        { id: '1', name: 'João' },
        { id: '2', name: 'Maria' },
        { id: '3', name: 'Pedro' },
      ]
      const state = { ...initialState, participants }
      const action = { type: ACTIONS.REMOVE_PARTICIPANT, payload: '2' }
      const newState = appReducer(state, action)
      
      expect(newState.participants).toHaveLength(2)
      expect(newState.participants).not.toContainEqual({ id: '2', name: 'Maria' })
      expect(newState.participants).toContainEqual({ id: '1', name: 'João' })
      expect(newState.participants).toContainEqual({ id: '3', name: 'Pedro' })
    })

    it('should clear error when removing participant', () => {
      const state = {
        ...initialState,
        participants: [{ id: '1', name: 'João' }],
        error: 'Some error'
      }
      const action = { type: ACTIONS.REMOVE_PARTICIPANT, payload: '1' }
      const newState = appReducer(state, action)
      
      expect(newState.error).toBe('')
    })

    it('should handle removing non-existent participant', () => {
      const participants = [{ id: '1', name: 'João' }]
      const state = { ...initialState, participants }
      const action = { type: ACTIONS.REMOVE_PARTICIPANT, payload: '999' }
      const newState = appReducer(state, action)
      
      expect(newState.participants).toEqual(participants)
    })
  })

  describe('CLEAR_ALL_PARTICIPANTS', () => {
    it('should clear all participants, teams, and bench players', () => {
      const state = {
        ...initialState,
        participants: [{ id: '1', name: 'João' }],
        teams: [{ color: 'red', players: [] }],
        benchPlayers: [{ id: '2', name: 'Maria' }],
        error: 'Some error'
      }
      const action = { type: ACTIONS.CLEAR_ALL_PARTICIPANTS }
      const newState = appReducer(state, action)
      
      expect(newState.participants).toEqual([])
      expect(newState.teams).toEqual([])
      expect(newState.benchPlayers).toEqual([])
      expect(newState.error).toBe('')
    })
  })

  describe('START_EDITING', () => {
    it('should set editing state', () => {
      const action = {
        type: ACTIONS.START_EDITING,
        payload: { id: '1', name: 'João' }
      }
      const newState = appReducer(initialState, action)
      
      expect(newState.editingId).toBe('1')
      expect(newState.editedName).toBe('João')
      expect(newState.error).toBe('')
    })

    it('should clear any existing error', () => {
      const state = { ...initialState, error: 'Some error' }
      const action = {
        type: ACTIONS.START_EDITING,
        payload: { id: '1', name: 'João' }
      }
      const newState = appReducer(state, action)
      
      expect(newState.error).toBe('')
    })
  })

  describe('SET_EDITED_NAME', () => {
    it('should update edited name', () => {
      const action = { type: ACTIONS.SET_EDITED_NAME, payload: 'João Silva' }
      const newState = appReducer(initialState, action)
      
      expect(newState.editedName).toBe('João Silva')
    })
  })

  describe('SAVE_EDIT', () => {
    it('should update participant name', () => {
      const participants = [
        { id: '1', name: 'João' },
        { id: '2', name: 'Maria' },
      ]
      const state = {
        ...initialState,
        participants,
        editingId: '1',
        editedName: 'João Silva'
      }
      const action = {
        type: ACTIONS.SAVE_EDIT,
        payload: { id: '1', name: 'João Silva' }
      }
      const newState = appReducer(state, action)
      
      expect(newState.participants[0].name).toBe('João Silva')
      expect(newState.participants[1].name).toBe('Maria')
      expect(newState.editingId).toBeNull()
      expect(newState.editedName).toBe('')
      expect(newState.error).toBe('')
    })

    it('should not mutate participants array', () => {
      const participants = [{ id: '1', name: 'João' }]
      const state = { ...initialState, participants, editingId: '1' }
      const action = {
        type: ACTIONS.SAVE_EDIT,
        payload: { id: '1', name: 'João Silva' }
      }
      const newState = appReducer(state, action)
      
      expect(newState.participants).not.toBe(participants)
    })
  })

  describe('CANCEL_EDIT', () => {
    it('should clear editing state', () => {
      const state = {
        ...initialState,
        editingId: '1',
        editedName: 'João',
        error: 'Some error'
      }
      const action = { type: ACTIONS.CANCEL_EDIT }
      const newState = appReducer(state, action)
      
      expect(newState.editingId).toBeNull()
      expect(newState.editedName).toBe('')
      expect(newState.error).toBe('')
    })
  })

  describe('SET_TEAMS', () => {
    it('should set teams and bench players', () => {
      const teams = [
        { color: 'red', players: [{ id: '1', name: 'João' }] },
        { color: 'blue', players: [{ id: '2', name: 'Maria' }] },
      ]
      const benchPlayers = [{ id: '3', name: 'Pedro' }]
      const action = {
        type: ACTIONS.SET_TEAMS,
        payload: { teams, benchPlayers }
      }
      const newState = appReducer(initialState, action)
      
      expect(newState.teams).toEqual(teams)
      expect(newState.benchPlayers).toEqual(benchPlayers)
      expect(newState.error).toBe('')
      expect(newState.openDrawDialog).toBe(false)
    })

    it('should close draw dialog and clear error', () => {
      const state = {
        ...initialState,
        openDrawDialog: true,
        error: 'Some error'
      }
      const action = {
        type: ACTIONS.SET_TEAMS,
        payload: { teams: [], benchPlayers: [] }
      }
      const newState = appReducer(state, action)
      
      expect(newState.openDrawDialog).toBe(false)
      expect(newState.error).toBe('')
    })
  })

  describe('CLEAR_DRAW', () => {
    it('should clear teams and bench players', () => {
      const state = {
        ...initialState,
        teams: [{ color: 'red', players: [] }],
        benchPlayers: [{ id: '1', name: 'João' }],
        error: 'Some error'
      }
      const action = { type: ACTIONS.CLEAR_DRAW }
      const newState = appReducer(state, action)
      
      expect(newState.teams).toEqual([])
      expect(newState.benchPlayers).toEqual([])
      expect(newState.error).toBe('')
    })
  })

  describe('TOGGLE_PARTICIPANTS', () => {
    it('should toggle openParticipants from true to false', () => {
      const state = { ...initialState, openParticipants: true }
      const action = { type: ACTIONS.TOGGLE_PARTICIPANTS }
      const newState = appReducer(state, action)
      
      expect(newState.openParticipants).toBe(false)
    })

    it('should toggle openParticipants from false to true', () => {
      const state = { ...initialState, openParticipants: false }
      const action = { type: ACTIONS.TOGGLE_PARTICIPANTS }
      const newState = appReducer(state, action)
      
      expect(newState.openParticipants).toBe(true)
    })
  })

  describe('SET_OPEN_CLEAR_DIALOG', () => {
    it('should set openClearDialog to true', () => {
      const action = { type: ACTIONS.SET_OPEN_CLEAR_DIALOG, payload: true }
      const newState = appReducer(initialState, action)
      
      expect(newState.openClearDialog).toBe(true)
    })

    it('should set openClearDialog to false', () => {
      const state = { ...initialState, openClearDialog: true }
      const action = { type: ACTIONS.SET_OPEN_CLEAR_DIALOG, payload: false }
      const newState = appReducer(state, action)
      
      expect(newState.openClearDialog).toBe(false)
    })
  })

  describe('SET_OPEN_DRAW_DIALOG', () => {
    it('should set openDrawDialog to true', () => {
      const action = { type: ACTIONS.SET_OPEN_DRAW_DIALOG, payload: true }
      const newState = appReducer(initialState, action)
      
      expect(newState.openDrawDialog).toBe(true)
    })

    it('should set openDrawDialog to false', () => {
      const state = { ...initialState, openDrawDialog: true }
      const action = { type: ACTIONS.SET_OPEN_DRAW_DIALOG, payload: false }
      const newState = appReducer(state, action)
      
      expect(newState.openDrawDialog).toBe(false)
    })
  })

  describe('LOAD_DATA', () => {
    it('should load participants, teams, and bench players', () => {
      const participants = [{ id: '1', name: 'João' }]
      const teams = [{ color: 'red', players: [] }]
      const benchPlayers = [{ id: '2', name: 'Maria' }]
      const action = {
        type: ACTIONS.LOAD_DATA,
        payload: { participants, teams, benchPlayers }
      }
      const newState = appReducer(initialState, action)
      
      expect(newState.participants).toEqual(participants)
      expect(newState.teams).toEqual(teams)
      expect(newState.benchPlayers).toEqual(benchPlayers)
    })

    it('should handle null/undefined values', () => {
      const action = {
        type: ACTIONS.LOAD_DATA,
        payload: { participants: null, teams: undefined, benchPlayers: null }
      }
      const newState = appReducer(initialState, action)
      
      expect(newState.participants).toEqual([])
      expect(newState.teams).toEqual([])
      expect(newState.benchPlayers).toEqual([])
    })

    it('should only load provided data', () => {
      const participants = [{ id: '1', name: 'João' }]
      const action = {
        type: ACTIONS.LOAD_DATA,
        payload: { participants }
      }
      const newState = appReducer(initialState, action)
      
      expect(newState.participants).toEqual(participants)
      expect(newState.teams).toEqual([])
      expect(newState.benchPlayers).toEqual([])
    })
  })

  describe('SET_DATA_LOADED', () => {
    it('should set dataLoaded to true', () => {
      const action = { type: ACTIONS.SET_DATA_LOADED }
      const newState = appReducer(initialState, action)
      
      expect(newState.dataLoaded).toBe(true)
    })
  })

  describe('default case', () => {
    it('should return current state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' }
      const newState = appReducer(initialState, action)
      
      expect(newState).toBe(initialState)
    })

    it('should not mutate state for unknown action', () => {
      const state = { ...initialState, participants: [{ id: '1', name: 'João' }] }
      const action = { type: 'UNKNOWN_ACTION' }
      const newState = appReducer(state, action)
      
      expect(newState).toBe(state)
      expect(newState.participants).toBe(state.participants)
    })
  })

  describe('immutability', () => {
    it('should never mutate the original state', () => {
      const state = {
        ...initialState,
        participants: [{ id: '1', name: 'João' }],
        teams: [{ color: 'red', players: [] }],
      }
      const stateCopy = JSON.parse(JSON.stringify(state))
      
      // Test multiple actions
      appReducer(state, { type: ACTIONS.SET_NEW_NAME, payload: 'Maria' })
      appReducer(state, { type: ACTIONS.ADD_PARTICIPANT, payload: { id: '2', name: 'Pedro' } })
      appReducer(state, { type: ACTIONS.REMOVE_PARTICIPANT, payload: '1' })
      
      expect(state).toEqual(stateCopy)
    })
  })

  describe('ACTIONS constants', () => {
    it('should have all required action types', () => {
      expect(ACTIONS.SET_NEW_NAME).toBe('SET_NEW_NAME')
      expect(ACTIONS.SET_ERROR).toBe('SET_ERROR')
      expect(ACTIONS.CLEAR_ERROR).toBe('CLEAR_ERROR')
      expect(ACTIONS.ADD_PARTICIPANT).toBe('ADD_PARTICIPANT')
      expect(ACTIONS.REMOVE_PARTICIPANT).toBe('REMOVE_PARTICIPANT')
      expect(ACTIONS.CLEAR_ALL_PARTICIPANTS).toBe('CLEAR_ALL_PARTICIPANTS')
      expect(ACTIONS.START_EDITING).toBe('START_EDITING')
      expect(ACTIONS.SET_EDITED_NAME).toBe('SET_EDITED_NAME')
      expect(ACTIONS.SAVE_EDIT).toBe('SAVE_EDIT')
      expect(ACTIONS.CANCEL_EDIT).toBe('CANCEL_EDIT')
      expect(ACTIONS.SET_TEAMS).toBe('SET_TEAMS')
      expect(ACTIONS.CLEAR_DRAW).toBe('CLEAR_DRAW')
      expect(ACTIONS.TOGGLE_PARTICIPANTS).toBe('TOGGLE_PARTICIPANTS')
      expect(ACTIONS.SET_OPEN_CLEAR_DIALOG).toBe('SET_OPEN_CLEAR_DIALOG')
      expect(ACTIONS.SET_OPEN_DRAW_DIALOG).toBe('SET_OPEN_DRAW_DIALOG')
      expect(ACTIONS.LOAD_DATA).toBe('LOAD_DATA')
      expect(ACTIONS.SET_DATA_LOADED).toBe('SET_DATA_LOADED')
    })
  })
})

