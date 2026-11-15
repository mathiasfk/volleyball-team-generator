
import { AlertCircle, ChevronDown, HelpCircle, ListChevronsDownUp, ListChevronsUpDown, Shuffle, Users } from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Joyride, { ACTIONS as JOYRIDE_ACTIONS, EVENTS, STATUS } from 'react-joyride'

import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.jsx'

import { STORAGE_KEYS } from '../constants/storageKeys.ts'
import { getTeamColors } from '../constants/teamColors.ts'
import useSEO from '../hooks/useSEO.js'
import { calculateTeams } from '../lib/calculateTeams.js'
import { ACTIONS, appReducer, initialState } from '../reducers/appReducer.js'
import { gtag } from '../services/analytics.js'
import { loadFromStorage, removeFromStorage, removeMultipleFromStorage, saveToStorage } from '../utils/localStorage.ts'
import { createPlayerPositionMap, detectPlayerChanges } from '../utils/playerChanges.ts'
import { formatParticipantName, isDuplicateName, isEmptyName } from '../utils/validation.ts'
import BenchCard from './BenchCard.jsx'
import ClearParticipantsDialog from './ClearParticipantsDialog.jsx'
import EditParticipantDialog from './EditParticipantDialog.jsx'
import FAQDialog from './FAQDialog.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import ParticipantForm from './ParticipantForm.jsx'
import ParticipantList from './ParticipantList.jsx'
import TeamCard from './TeamCard.jsx'
import ThemeSelector from './ThemeSelector.jsx'
import { AlertDialog } from './ui/alert-dialog.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.jsx'

// Function to create example participants for the tour
function createExampleParticipants(t) {
  const baseTime = Date.now()
  return [
    {
      id: `${baseTime}-1`,
      name: t('participants.example_player', { number: 1 }),
      weight: 1,
      role: 'any',
    },
    {
      id: `${baseTime}-2`,
      name: t('participants.example_player', { number: 2 }),
      weight: 1,
      role: 'any',
    },
    {
      id: `${baseTime}-3`,
      name: t('participants.example_player', { number: 3 }),
      weight: 1,
      role: 'any',
    },
    {
      id: `${baseTime}-4`,
      name: t('participants.example_player', { number: 4 }),
      weight: 1,
      role: 'any',
    },
    {
      id: `${baseTime}-5`,
      name: t('participants.example_player', { number: 5 }),
      weight: 1,
      role: 'any',
    },
  ]
}

// Function to check if all participants are example participants
function areAllExampleParticipants(participants, t) {
  if (participants.length !== 5) return false

  // Check if all participants have names matching the example pattern
  return participants.every(p => {
    // Check if name matches pattern for any number 1-5
    for (let i = 1; i <= 5; i++) {
      const exampleName = t('participants.example_player', { number: i })
      if (p.name === exampleName) return true
    }
    return false
  })
}

function MainApp() {
  const { t } = useTranslation()
  useSEO() // Initialize SEO management

  const [state, dispatch] = useReducer(appReducer, initialState)
  const clearHighlightTimeoutRef = useRef(null)

  const {
    participants,
    newName,
    teams,
    benchPlayers,
    error,
    dataLoaded,
    openParticipants,
    changedPlayerIds,
    previousPlayerPositions,
  } = state

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [runTour, setRunTour] = useState(false)
  const [tourPrimary, setTourPrimary] = useState(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())
  useEffect(() => {
    const update = () => setTourPrimary(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    update()
    return () => observer.disconnect()
  }, [])

  // Vibrant colors for teams
  const teamColors = getTeamColors(t)

  // Tour steps configuration
  const tourSteps = [
    {
      target: '.tour-participant-form',
      content: t('tour.participant_form'),
      disableBeacon: true,
    },
    {
      target: '.tour-participant-list',
      content: t('tour.participant_list'),
    },
    {
      target: '.tour-draw-button',
      content: t('tour.draw_button'),
    },
    ...(teams.length > 0 ? [
      {
        target: '.tour-teams',
        content: t('tour.teams'),
        placement: 'top',
      },
      ...(benchPlayers.length > 0 ? [{
        target: '.tour-bench',
        content: t('tour.bench'),
        placement: 'top',
      }] : []),
    ] : []),
    {
      target: '.tour-language-selector',
      content: t('tour.language'),
      placement: 'bottom',
    },
    {
      target: '.tour-faq-button',
      content: t('tour.faq'),
      placement: 'top',
    },
    {
      target: 'body',
      content: t('tour.complete'),
      placement: 'center',
    },
  ]

  // Load data from localStorage on initialization
  useEffect(() => {
    if (dataLoaded) return // Prevent re-loading if already done

    const [loadedParticipants, errorParticipants] = loadFromStorage(STORAGE_KEYS.PARTICIPANTS)
    const [loadedTeams, errorTeams] = loadFromStorage(STORAGE_KEYS.TEAMS)
    const [loadedBench, errorBench] = loadFromStorage(STORAGE_KEYS.BENCH)
    const [tourCompleted] = loadFromStorage(STORAGE_KEYS.TOUR_COMPLETED)

    // Check if we should load example participants
    const shouldLoadExamples = (!loadedParticipants || loadedParticipants.length === 0) && !tourCompleted

    let finalParticipants = loadedParticipants
    let finalTeams = loadedTeams
    let finalBench = loadedBench

    // If we should load examples, create them and calculate teams
    if (shouldLoadExamples) {
      finalParticipants = createExampleParticipants(t)
      // Calculate teams with example participants
      const { formedTeams, remainingPlayers } = calculateTeams({
        participants: finalParticipants,
        teams: [],
        benchPlayers: [],
      })
      finalTeams = formedTeams
      finalBench = remainingPlayers
    }

    // Combine any errors
    const errorLoading = !!errorParticipants || !!errorTeams ? ({
      [STORAGE_KEYS.PARTICIPANTS]: errorParticipants?.message,
      [STORAGE_KEYS.TEAMS]: errorTeams?.message,
      [STORAGE_KEYS.BENCH]: errorBench?.message
    }) : null

    dispatch({
      type: ACTIONS.LOAD_DATA,
      payload: {
        participants: finalParticipants || [],
        teams: finalTeams || [],
        benchPlayers: finalBench || [],
      }
    })

    gtag('event', 'load_local_storage', {
      'found_storage': !!loadedParticipants || !!loadedTeams,
      'loaded_participant_count': loadedParticipants ? loadedParticipants.length : 0,
      'loaded_team_count': loadedTeams ? loadedTeams.length : 0,
      'loaded_bench_count': loadedBench ? loadedBench.length : 0,
      'using_examples': shouldLoadExamples,
      'error_loading': errorLoading ? JSON.stringify(errorLoading) : null,
    });

    // Mark that data has been loaded (or attempt was made)
    dispatch({ type: ACTIONS.SET_DATA_LOADED })
  }, [dataLoaded, t])

  // Check if user has seen the tour and start it if not
  useEffect(() => {
    if (!dataLoaded) return

    const [tourCompleted] = loadFromStorage(STORAGE_KEYS.TOUR_COMPLETED)

    if (!tourCompleted) {
      // Start tour with a delay for better UX
      const timer = setTimeout(() => {
        setRunTour(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [dataLoaded])

  const handleTourComplete = () => {
    saveToStorage(STORAGE_KEYS.TOUR_COMPLETED, true)
    setRunTour(false)
  }

  const handleTourSkip = () => {
    saveToStorage(STORAGE_KEYS.TOUR_COMPLETED, true)
    setRunTour(false)
  }

  const restartTour = () => {
    removeFromStorage(STORAGE_KEYS.TOUR_COMPLETED)
    setRunTour(true)
  }

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

  // Keep the persisted draw in sync when a player is edited or removed.
  useEffect(() => {
    if (!dataLoaded) return
    saveToStorage(STORAGE_KEYS.TEAMS, teams)
    saveToStorage(STORAGE_KEYS.BENCH, benchPlayers)
  }, [dataLoaded, teams, benchPlayers])

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

    // If all current participants are examples, clear them first
    if (areAllExampleParticipants(participants, t)) {
      dispatch({ type: ACTIONS.CLEAR_ALL_PARTICIPANTS })
      // Also clear teams and bench
      dispatch({ type: ACTIONS.CLEAR_DRAW })
    }

    const newParticipant = {
      id: participantId,
      name: formattedName,
      weight: 1,
      role: 'any',
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

  const openEditDialog = (participant) => {
    gtag('event', 'edit_participant_start', {
      'previous_name': participant.name,
      'id': participant.id
    });

    setEditingParticipant(participant)
    setEditDialogOpen(true)
  }

  const saveParticipantEdit = (updates) => {
    const formattedName = formatParticipantName(updates.name)
    const isDuplicate = isDuplicateName(formattedName, participants, updates.id)
    const isEmpty = isEmptyName(updates.name)

    gtag('event', 'edit_participant_save', {
      'new_name': formattedName,
      'new_weight': updates.weight,
      'new_role': updates.role,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': updates.id
    });

    if (isEmpty) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.empty_name') })
      return false
    }

    if (isDuplicate) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.duplicate_name') })
      return false
    }

    dispatch({
      type: ACTIONS.UPDATE_PARTICIPANT,
      payload: { id: updates.id, name: formattedName, weight: updates.weight, role: updates.role }
    })

    setEditDialogOpen(false)
    setEditingParticipant(null)
    return true
  }

  const handleInlineNameUpdate = (id, newName) => {
    const formattedName = formatParticipantName(newName)
    const isDuplicate = isDuplicateName(formattedName, participants, id)
    const isEmpty = isEmptyName(newName)

    gtag('event', 'inline_edit_participant_name', {
      'new_name': formattedName,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': id
    })

    if (isEmpty) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.empty_name') })
      return false // Return false to indicate validation failed
    }

    if (isDuplicate) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('errors.duplicate_name') })
      return false // Return false to indicate validation failed
    }

    dispatch({
      type: ACTIONS.UPDATE_PARTICIPANT,
      payload: { id, name: formattedName }
    })

    return true // Return true to indicate success
  }

  const handleDrawTeamsClick = () => {
    gtag('event', 'draw_team_primary', {
      'participant_count': participants.length,
      'has_existing_teams': teams.length > 0
    });
    drawTeams(null)
  }

  const handleDropdownOpenChange = (open) => {
    if (open) {
      gtag('event', 'draw_teams_dropdown_open', {
        'participant_count': participants.length,
        'team_count': teams.length
      });
    }
  }

  const handleKeepTeam = (keepTeamId) => {
    gtag('event', 'draw_team_dropdown', {
      'participant_count': participants.length,
      'keep_team_action': keepTeamId === 0 ? 'keep_red' : 'keep_blue'
    });
    drawTeams(keepTeamId)
  }

  const drawTeams = (keepTeamId = null) => {
    // Clear any existing timeout to prevent conflicts
    if (clearHighlightTimeoutRef.current) {
      clearTimeout(clearHighlightTimeoutRef.current)
      clearHighlightTimeoutRef.current = null
    }

    // If there are currently highlighted players, clear them immediately
    // This allows the previous animation to finish gracefully
    if (changedPlayerIds.length > 0) {
      dispatch({ type: ACTIONS.CLEAR_CHANGED_PLAYERS })
    }

    // calculateTeams now works directly with Participant objects
    const { formedTeams, remainingPlayers } = calculateTeams({
      participants: participants,
      teams: teams,
      benchPlayers: benchPlayers,
      keepTeamId: keepTeamId
    })

    // Detect which players changed positions
    const changedPlayersSet = detectPlayerChanges(
      previousPlayerPositions,
      formedTeams,
      remainingPlayers
    )

    // Convert Set to Array for immutable state
    const changedPlayersArray = Array.from(changedPlayersSet)

    // Create new position map for next comparison
    const newPlayerPositions = createPlayerPositionMap(formedTeams, remainingPlayers)

    const keepTeamAction = keepTeamId === 0 ? 'keep_red' : keepTeamId === 1 ? 'keep_blue' : 'redraw_all'

    gtag('event', 'draw_team', {
      'participant_count': participants.length,
      'new_teams_count': formedTeams.length,
      'new_bench_players_count': remainingPlayers.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length,
      'keep_team_action': keepTeamAction,
      'changed_players_count': changedPlayersArray.length
    });

    // Use a small delay to ensure the cleared state is processed before applying new highlights
    setTimeout(() => {
      dispatch({
        type: ACTIONS.SET_TEAMS,
        payload: {
          teams: formedTeams,
          benchPlayers: remainingPlayers,
          changedPlayerIds: changedPlayersArray,
          newPlayerPositions: newPlayerPositions
        }
      })

      // Save teams to localStorage
      saveToStorage(STORAGE_KEYS.TEAMS, formedTeams)
      saveToStorage(STORAGE_KEYS.BENCH, remainingPlayers)

      // Clear the highlight after animation completes (4 seconds)
      clearHighlightTimeoutRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.CLEAR_CHANGED_PLAYERS })
        clearHighlightTimeoutRef.current = null
      }, 4000)
    }, 50)
  }

  const clearDraw = () => {
    // Clear any pending highlight timeout
    if (clearHighlightTimeoutRef.current) {
      clearTimeout(clearHighlightTimeoutRef.current)
      clearHighlightTimeoutRef.current = null
    }

    gtag('event', 'clear_draw', {
      'participant_count': participants.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length
    });

    dispatch({ type: ACTIONS.CLEAR_DRAW })
    removeFromStorage(STORAGE_KEYS.TEAMS)
    removeFromStorage(STORAGE_KEYS.BENCH)
  }

  // Helper function to track tour events
  const trackTourEvent = (eventName, data) => {
    gtag('event', eventName, {
      'step_index': data.index,
      'step_count': data.size
    })
  }

  // Map tour events and actions to tracking event names
  const tourEventMap = {
    [EVENTS.TOUR_START]: 'tour_started',
    [`${EVENTS.STEP_AFTER}_${JOYRIDE_ACTIONS.NEXT}`]: 'tour_next_step',
    [`${EVENTS.STEP_AFTER}_${JOYRIDE_ACTIONS.PREV}`]: 'tour_previous_step',
    [`${EVENTS.TOUR_END}_${STATUS.SKIPPED}`]: 'tour_skipped',
    [`${EVENTS.TOUR_END}_${STATUS.FINISHED}`]: 'tour_completed',
  }

  return (
    <div className="min-h-screen p-4 bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress={true}
        showSkipButton
        callback={(data) => {
          // Determine event key based on type, action, and status
          let eventKey = data.type
          if (data.type === EVENTS.STEP_AFTER && data.action) {
            eventKey = `${data.type}_${data.action}`
          } else if (data.type === EVENTS.TOUR_END && data.status) {
            eventKey = `${data.type}_${data.status}`
          }

          // Track event if mapped
          const eventName = tourEventMap[eventKey]
          if (eventName) {
            trackTourEvent(eventName, data)
          }

          // Handle tour completion/skip
          if (data.type === EVENTS.TOUR_END) {
            if (data.status === STATUS.SKIPPED) {
              handleTourSkip()
            } else if (data.status === STATUS.FINISHED) {
              handleTourComplete()
            }
          }
        }}
        styles={{
          options: {
            primaryColor: tourPrimary,
            textColor: 'var(--foreground)',
            backgroundColor: 'var(--card)',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            arrowColor: 'var(--card)',
          },
          tooltip: {
            borderRadius: 8,
          },
          buttonNext: {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 6,
          },
          buttonBack: {
            color: 'var(--muted-foreground)',
            marginRight: 10,
          },
          buttonSkip: {
            color: 'var(--muted-foreground)',
          },
        }}
        locale={{
          back: t('tour.back'),
          close: t('tour.close'),
          last: t('tour.last'),
          nextLabelWithProgress: `${t('tour.next')} ({step}/{steps})`,
          skip: t('tour.skip'),
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="ds-text-display text-xl sm:text-2xl text-[var(--color-text-primary)]">
            {t('app.title')}
          </h1>
          <div className="ms-auto flex items-center gap-2">
            <ThemeSelector />
            <LanguageSelector onRestartTour={restartTour} />
          </div>
        </div>

          {/* Error Alert */}
          {error && !editDialogOpen && (
            <Alert className="mb-6 border-[var(--color-action-destructive)] bg-[var(--color-action-destructive)]/20">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-[var(--color-text-primary)]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Add Participants Section */}
          <Collapsible open={openParticipants} onOpenChange={onCollapsibleToggle}>
            <Card className="mb-6 border-[var(--color-border)] bg-[var(--color-card-primary)]">
              <CardHeader>
                <CollapsibleTrigger className="mb-4 text-left w-full">
                  <CardTitle className="ds-text-emphasis flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Users className="w-5 h-5" />
                    {t('participants.manage')}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="ms-auto cursor-pointer"
                          aria-label={openParticipants ? t('actions.collapse', { defaultValue: 'Colapsar' }) : t('actions.expand', { defaultValue: 'Expandir' })}
                        >
                          {openParticipants ? <ListChevronsDownUp className="w-5 h-5" /> : <ListChevronsUpDown className="w-5 h-5" />}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {openParticipants ? t('actions.collapse', { defaultValue: 'Colapsar' }) : t('actions.expand', { defaultValue: 'Expandir' })}
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent className="mb-6">
                <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
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
                    onEdit={openEditDialog}
                    onRemove={removeParticipant}
                    onInlineNameUpdate={handleInlineNameUpdate}
                  />

                  {/* Edit Participant Dialog */}
                  <EditParticipantDialog
                    open={editDialogOpen}
                    onOpenChange={(open) => { setEditDialogOpen(open); if (!open) clearError() }}
                    error={error}
                    onClearError={clearError}
                    participant={editingParticipant}
                    onSave={saveParticipantEdit}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            {teams.length === 0 ? (
              // Simple button when no teams exist
              <Button
                onClick={handleDrawTeamsClick}
                disabled={participants.length === 0}
                className="tour-draw-button w-full px-8 py-3 md:w-auto bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground ds-text-primary"
              >
                <Shuffle className="size-5 me-2" />
                {t('actions.draw_teams')}
              </Button>
            ) : (
              // Split button when teams exist
              <div className="flex items-stretch tour-draw-button w-full md:w-auto">
                <Button
                  onClick={handleDrawTeamsClick}
                  disabled={participants.length === 0}
                  className="flex-1 px-8 py-3 rounded-r-none border-r border-white/20 bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50 md:flex-initial ds-text-primary"
                >
                  <Shuffle className="size-5 me-2" />
                  {t('dialog.draw_teams.redraw_all')}
                </Button>
                <DropdownMenu onOpenChange={handleDropdownOpenChange}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={participants.length === 0}
                      className="flex items-center rounded-l-none border-l border-white/20 px-3 py-3 bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50 md:flex-initial"
                      aria-label={t('actions.more_options', { defaultValue: 'Mais opções' })}
                    >
                      <ChevronDown className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px] border-[var(--color-border)] bg-[var(--color-card-primary)] text-[var(--color-text-primary)]">
                    <DropdownMenuItem
                      onClick={() => handleKeepTeam(0)}
                      className="cursor-pointer py-2.5 focus:bg-[var(--color-card-secondary)] focus:text-[var(--color-text-primary)]"
                    >
                      <span className="me-2 font-bold text-[var(--color-team-red)]">●</span>
                      {t('dialog.draw_teams.keep_red')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleKeepTeam(1)}
                      className="cursor-pointer py-2.5 focus:bg-[var(--color-card-secondary)] focus:text-[var(--color-text-primary)]"
                    >
                      <span className="me-2 font-bold text-[var(--color-team-blue)]">●</span>
                      {t('dialog.draw_teams.keep_blue')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {teams.length > 0 && (
              <Button
                onClick={clearDraw}
                variant="outline"
                className="w-full border-[var(--color-border)] bg-[var(--color-card-secondary)] px-8 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-border-highlight)] hover:border-[var(--color-border-highlight)] md:w-auto ds-text-primary"
              >
                {t('actions.clear_draw')}
              </Button>
            )}
          </div>

          {/* Draw Results */}
          {teams.length > 0 && (
            <div className="space-y-6 tour-results">
              <h2 className="ds-text-section text-center text-[var(--color-text-primary)]">
                {t('results.title')}
              </h2>

              {/* Teams (main hierarchy) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 tour-teams">
                {teams.map((team, index) => {
                  const teamColor = teamColors[index % teamColors.length]
                  return (
                    <TeamCard
                      key={index}
                      team={team}
                      teamColor={teamColor}
                      index={index}
                      changedPlayerIds={changedPlayerIds}
                      onInlineNameUpdate={handleInlineNameUpdate}
                    />
                  )
                })}
              </div>

              {/* Bench / outside match (secondary hierarchy) */}
              {benchPlayers.length > 0 && (
                <section aria-label={t('results.bench_title')} className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <BenchCard
                    benchPlayers={benchPlayers}
                    changedPlayerIds={changedPlayerIds}
                    onInlineNameUpdate={handleInlineNameUpdate}
                  />
                </section>
              )}
            </div>
          )}

          {/* FAQ Link */}
          <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center">
            <button
              onClick={() => setFaqDialogOpen(true)}
              className="tour-faq-button inline-flex items-center gap-2 ds-text-small text-[var(--color-text-secondary)] transition-colors hover:text-[var(--link)]"
            >
              <HelpCircle className="size-4" />
              {t('faq.button')}
            </button>
          </div>

          {/* FAQ Dialog */}
          <FAQDialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen} />
      </div>
    </div>
  )
}

export default MainApp
