import './App.css'

import { AlertCircle, ListChevronsDownUp, ListChevronsUpDown,Shuffle, Users } from 'lucide-react'
import { useEffect,useReducer } from 'react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

import BenchCard from './components/BenchCard.jsx'
import ClearParticipantsDialog from './components/ClearParticipantsDialog.jsx'
import DrawTeamsDialog from './components/DrawTeamsDialog.jsx'
import LanguageSelector from './components/LanguageSelector.jsx'
import ParticipantForm from './components/ParticipantForm.jsx'
import ParticipantList from './components/ParticipantList.jsx'
import TeamCard from './components/TeamCard.jsx'
import { AlertDialog } from './components/ui/alert-dialog.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible.jsx'
import { STORAGE_KEYS } from './constants/storageKeys.ts'
import { getTeamColors } from './constants/teamColors.ts'
import useSEO from './hooks/useSEO.js'
import { calculateTeams } from './lib/calculateTeams.js'
import { ACTIONS,appReducer, initialState } from './reducers/appReducer.js'
import { gtag } from './services/analytics.js'
import { loadFromStorage, removeFromStorage, removeMultipleFromStorage,saveToStorage } from './utils/localStorage.ts'
import { formatParticipantName,isDuplicateName, isEmptyName } from './utils/validation.ts'

function App() {
  const { t } = useTranslation()
  useSEO() // Initialize SEO management
  
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  const {
    participants,
    newName,
    editingId,
    editedName,
    teams,
    benchPlayers,
    error,
    dataLoaded,
    openParticipants,
    openDrawDialog,
  } = state

  // Vibrant colors for teams
  const teamColors = getTeamColors(t)

  // Load data from localStorage on initialization
  useEffect(() => {
    if (dataLoaded) return // Prevent re-loading if already done

    const [loadedParticipants, errorParticipants] = loadFromStorage(STORAGE_KEYS.PARTICIPANTS)
    const [loadedTeams, errorTeams] = loadFromStorage(STORAGE_KEYS.TEAMS)
    const [loadedBench, errorBench] = loadFromStorage(STORAGE_KEYS.BENCH)

    // Combine any errors
    const errorLoading = !!errorParticipants || !!errorTeams ? ({
      [STORAGE_KEYS.PARTICIPANTS]: errorParticipants?.message,
      [STORAGE_KEYS.TEAMS]: errorTeams?.message,
      [STORAGE_KEYS.BENCH]: errorBench?.message
    }) : null

    dispatch({
      type: ACTIONS.LOAD_DATA,
      payload: {
        participants: loadedParticipants,
        teams: loadedTeams,
        benchPlayers: loadedBench,
      }
    })

    gtag('event', 'load_local_storage', {
      'found_storage': !!loadedParticipants || !!loadedTeams,
      'loaded_participant_count': loadedParticipants ? loadedParticipants.length : 0,
      'loaded_team_count': loadedTeams ? loadedTeams.length : 0,
      'loaded_bench_count': loadedBench ? loadedBench.length : 0,
      'error_loading': errorLoading ? JSON.stringify(errorLoading) : null,
    });

    // Mark that data has been loaded (or attempt was made)
    dispatch({ type: ACTIONS.SET_DATA_LOADED })
  }, [dataLoaded])

  const clearAllStorage = () => {
    removeMultipleFromStorage([
      STORAGE_KEYS.PARTICIPANTS,
      STORAGE_KEYS.TEAMS,
      STORAGE_KEYS.BENCH
    ])
  }

  // Save participants to localStorage whenever the list changes
  // BUT ONLY after initial data has been loaded
  useEffect(() => {
    if (!dataLoaded) {
      return
    }

    saveToStorage(STORAGE_KEYS.PARTICIPANTS, participants)
  }, [participants, dataLoaded])

  const clearError = () => {
    if (error) dispatch({ type: ACTIONS.CLEAR_ERROR })
  }

  const addParticipant = () => {
    const formattedName = formatParticipantName(newName)
    const isDuplicate = isDuplicateName(formattedName, participants)
    const isEmpty = isEmptyName(newName)
    const participantId = Date.now().toString()

    gtag('event', 'add_participant', {
      'participant_name': formattedName,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': participantId
    });

    if (isEmpty) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.empty_name') })
      return
    }

    if (isDuplicate) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.duplicate_name') })
      return
    }

    const newParticipant = {
      id: participantId,
      name: formattedName,
      weight: 1,
    }
    dispatch({ type: ACTIONS.ADD_PARTICIPANT, payload: newParticipant })
  }

  const removeParticipant = (id) => {
    gtag('event', 'remove_participant', {
      'id': id
    });
    dispatch({ type: ACTIONS.REMOVE_PARTICIPANT, payload: id })
  }

  const clearAllParticipantsStart = () => {
    gtag('event', 'clear_participants_start');
  }

  const clearAllParticipantsCancel = () => {
    gtag('event', 'clear_participants_cancel');
  }

  const clearAllParticipants = () => {
    gtag('event', 'clear_participants_confirm', {
      'participant_count': participants.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length
    });

    dispatch({ type: ACTIONS.CLEAR_ALL_PARTICIPANTS })
    clearAllStorage()
  }

  const onCollapsibleToggle = () => {
    gtag('event', 'toggle_participants_collapsible', {
      'was_open': openParticipants
    });
    
    dispatch({ type: ACTIONS.TOGGLE_PARTICIPANTS })
  }

  const startEditing = (participant) => {
    gtag('event', 'edit_participant_start', {
      'previous_name': participant.name,
      'id': participant.id
    });

    dispatch({
      type: ACTIONS.START_EDITING,
      payload: { id: participant.id, name: participant.name }
    })
  }

  const saveEdit = () => {
    const formattedName = formatParticipantName(editedName)
    const isDuplicate = isDuplicateName(formattedName, participants, editingId)
    const isEmpty = isEmptyName(editedName)

    gtag('event', 'edit_participant_save', {
      'new_name': formattedName,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': editingId
    });

    if (isEmpty) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.empty_name') })
      return
    }

    if (isDuplicate) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.duplicate_name') })
      return
    }

    dispatch({
      type: ACTIONS.SAVE_EDIT,
      payload: { id: editingId, name: formattedName }
    })
  }

  const cancelEdit = () => {
    gtag('event', 'edit_participant_cancel', {
      'id': editingId
    });

    dispatch({ type: ACTIONS.CANCEL_EDIT })
  }

  const openDrawTeamsDialog = () => {
    if (teams.length === 0) {
      drawTeams(null)
      return
    }
    
    gtag('event', 'draw_teams_dialog_open', {
      'participant_count': participants.length,
      'has_existing_teams': true
    });
    dispatch({ type: ACTIONS.SET_OPEN_DRAW_DIALOG, payload: true })
  }

  const cancelDrawTeams = () => {
    gtag('event', 'draw_teams_cancel');
    dispatch({ type: ACTIONS.SET_OPEN_DRAW_DIALOG, payload: false })
  }

  const drawTeams = (keepTeamId = null) => {
    // calculateTeams now works directly with Participant objects
    const { formedTeams, remainingPlayers } = calculateTeams({
      participants: participants, 
      teams: teams, 
      benchPlayers: benchPlayers,
      keepTeamId: keepTeamId
    })

    const keepTeamAction = keepTeamId === 0 ? 'keep_red' : keepTeamId === 1 ? 'keep_blue' : 'redraw_all'
    
    gtag('event', 'draw_team', {
      'participant_count': participants.length,
      'new_teams_count': formedTeams.length,
      'new_bench_players_count': remainingPlayers.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length,
      'keep_team_action': keepTeamAction
    });

    dispatch({
      type: ACTIONS.SET_TEAMS,
      payload: {
        teams: formedTeams,
        benchPlayers: remainingPlayers
      }
    })

    // Save teams to localStorage
    saveToStorage(STORAGE_KEYS.TEAMS, formedTeams)
    saveToStorage(STORAGE_KEYS.BENCH, remainingPlayers)
  }

  const clearDraw = () => {
    gtag('event', 'clear_draw', {
      'participant_count': participants.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length
    });

    dispatch({ type: ACTIONS.CLEAR_DRAW })
    removeFromStorage(STORAGE_KEYS.TEAMS)
    removeFromStorage(STORAGE_KEYS.BENCH)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="hidden sm:block text-4xl font-bold text-blue-400">
            {t('app.title')}
          </h1>
          <div className="ms-auto">
            <LanguageSelector />
          </div>
        </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Add Participants Section */}
          <Collapsible open={openParticipants} onOpenChange={onCollapsibleToggle}>
            <Card className="mb-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CollapsibleTrigger className="mb-4 text-left w-full">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {t('participants.manage')}
                    {openParticipants ? <ListChevronsDownUp className="w-5 h-5 ms-auto" /> : <ListChevronsUpDown className="w-5 h-5 ms-auto" />}
                  </CardTitle>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent className="mb-6">
                <CardContent>
                  <AlertDialog>
                    <ParticipantForm
                      newName={newName}
                      onNameChange={(value) => {
                        dispatch({ type: ACTIONS.SET_NEW_NAME, payload: value })
                        clearError()
                      }}
                      onAdd={addParticipant}
                      onClearStart={clearAllParticipantsStart}
                      participantsCount={participants.length}
                    />

                    <ClearParticipantsDialog
                      onConfirm={clearAllParticipants}
                      onCancel={clearAllParticipantsCancel}
                    />
                  </AlertDialog>

                  <ParticipantList
                    participants={participants}
                    editingId={editingId}
                    editedName={editedName}
                    onStartEdit={startEditing}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    onEditNameChange={(value) => {
                      dispatch({ type: ACTIONS.SET_EDITED_NAME, payload: value })
                      clearError()
                    }}
                    onRemove={removeParticipant}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <Button
              onClick={openDrawTeamsDialog}
              disabled={participants.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <Shuffle className="w-5 h-5 me-2" />
              {t('actions.draw_teams')}
            </Button>
            {teams.length > 0 && (
              <Button
                onClick={clearDraw}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-600 px-8 py-3 text-lg"
              >
                {t('actions.clear_draw')}
              </Button>
            )}
          </div>

          {/* Draw Teams Dialog */}
          <AlertDialog open={openDrawDialog} onOpenChange={(value) => dispatch({ type: ACTIONS.SET_OPEN_DRAW_DIALOG, payload: value })}>
            <DrawTeamsDialog
              hasExistingTeams={teams.length > 0}
              onDrawTeams={drawTeams}
              onCancel={cancelDrawTeams}
            />
          </AlertDialog>

          {/* Draw Results */}
          {teams.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-green-400">
                {t('results.title')}
              </h2>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {teams.map((team, index) => {
                  const teamColor = teamColors[index % teamColors.length]
                  return (
                    <TeamCard
                      key={index}
                      team={team}
                      teamColor={teamColor}
                      index={index}
                    />
                  )
                })}
              </div>

              {/* Bench Players */}
              <BenchCard benchPlayers={benchPlayers} />
            </div>
          )}
      </div>
    </div>
  )
}

export default App

