import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Trash2, Edit2, Users, Shuffle, AlertCircle, Trash, ListChevronsDownUp, ListChevronsUpDown } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector.jsx'
import useSEO from './hooks/useSEO.js'
import './App.css'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible.jsx'
import { calculateTeams } from './lib/calculateTeams.js'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog.jsx'
import { gtag } from './lib/analytics.js'

const LOCAL_STORAGE_KEY_PARTICIPANTS = 'volleyball-participants'
const LOCAL_STORAGE_KEY_TEAMS = 'volleyball-teams'
const LOCAl_STORAGE_KEY_BENCH = 'volleyball-bench'


function App() {
  const { t } = useTranslation()
  useSEO() // Initialize SEO management
  const [participants, setParticipants] = useState([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [teams, setTeams] = useState([])
  const [benchPlayers, setBenchPlayers] = useState([])
  const [error, setError] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [openParticipants, setOpenParticipants] = useState(true)
  const [openClearDialog, setOpenClearDialog] = useState(false)
  const [openDrawDialog, setOpenDrawDialog] = useState(false)

  // Vibrant colors for teams
  const teamColors = [
    { name: t('colors.red'), color: '#ef4444', textColor: '#ffffff' },
    { name: t('colors.blue'), color: '#3b82f6', textColor: '#ffffff' },
    { name: t('colors.green'), color: '#22c55e', textColor: '#ffffff' },
    { name: t('colors.purple'), color: '#a855f7', textColor: '#ffffff' },
    { name: t('colors.orange'), color: '#f97316', textColor: '#ffffff' },
    { name: t('colors.pink'), color: '#ec4899', textColor: '#ffffff' }
  ]

  // Load data from localStorage on initialization
  useEffect(() => {
    if (dataLoaded) return // Prevent re-loading if already done

    const [loadedParticipants, errorParticipants] = loadDataFromStorage(LOCAL_STORAGE_KEY_PARTICIPANTS)
    const [loadedTeams, errorTeams] = loadDataFromStorage(LOCAL_STORAGE_KEY_TEAMS)
    const [loadedBench, errorBench] = loadDataFromStorage(LOCAl_STORAGE_KEY_BENCH)

    // Combine any errors
    const errorLoading = !!errorParticipants || !!errorTeams ? ({
      [LOCAL_STORAGE_KEY_PARTICIPANTS]: errorParticipants?.message,
      [LOCAL_STORAGE_KEY_TEAMS]: errorTeams?.message,
      [LOCAl_STORAGE_KEY_BENCH]: errorBench?.message
    }) : null

    if (loadedParticipants) setParticipants(loadedParticipants)
    if (loadedTeams) setTeams(loadedTeams)
    if (loadedBench) setBenchPlayers(loadedBench)

    gtag('event', 'load_local_storage', {
      'found_storage': !!loadedParticipants || !!loadedTeams,
      'loaded_participant_count': loadedParticipants ? loadedParticipants.length : 0,
      'loaded_team_count': loadedTeams ? loadedTeams.length : 0,
      'loaded_bench_count': loadedBench ? loadedBench.length : 0,
      'error_loading': errorLoading ? JSON.stringify(errorLoading) : null,
    });

    // Mark that data has been loaded (or attempt was made)
    setDataLoaded(true)
  }, [])

  const loadDataFromStorage = (key) => {
    const savedData = localStorage.getItem(key)
    let parsedData = null
    let errorLoading = null
    if (savedData) {
      try {
        parsedData = JSON.parse(savedData)
      } catch (error) {
        console.error(`❌ Error parsing ${key} from localStorage:`, error)
        localStorage.removeItem(key)
        errorLoading = error
      }
    }
    return [parsedData, errorLoading]
  }

  const saveDataToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`❌ Error saving ${key} to localStorage:`, error)
    }
  }

  const clearFromStorage = (key) => {
    localStorage.removeItem(key)
  }

  const clearAllStorage = () => {
    clearFromStorage(LOCAL_STORAGE_KEY_PARTICIPANTS)
    clearFromStorage(LOCAL_STORAGE_KEY_TEAMS)
    clearFromStorage(LOCAl_STORAGE_KEY_BENCH)
  }

  // Save participants to localStorage whenever the list changes
  // BUT ONLY after initial data has been loaded
  useEffect(() => {
    if (!dataLoaded) {
      return
    }

    saveDataToStorage(LOCAL_STORAGE_KEY_PARTICIPANTS, participants)
  }, [participants, dataLoaded])

  const clearError = () => {
    if (error) setError('')
  }

  const isDuplicateName = (name, idToExclude = null) => {
    return participants.some(p =>
      p.nome.toLowerCase().trim() === name.toLowerCase().trim() &&
      p.id !== idToExclude
    )
  }

  const addParticipant = () => {
    const formattedName = newName.trim()
    const isDuplicate = isDuplicateName(formattedName)
    const isEmpty = formattedName === ''
    const participantId = Date.now().toString()

    gtag('event', 'add_participant', {
      'participant_name': formattedName,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': participantId
    });

    if (isEmpty) {
      setError(t('errors.empty_name'))
      return
    }

    if (isDuplicate) {
      setError(t('errors.duplicate_name'))
      return
    }

    const newParticipant = {
      id: participantId,
      nome: formattedName
    }
    setParticipants([...participants, newParticipant])
    setNewName('')
    clearError()
  }

  const removeParticipant = (id) => {
    gtag('event', 'remove_participant', {
      'id': id
    });
    setParticipants(participants.filter(p => p.id !== id))
    clearError()
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

    setParticipants([])
    setTeams([])
    setBenchPlayers([])
    clearError()
    clearAllStorage()
  }

  const onCollapsibleToggle = () => {
    gtag('event', 'toggle_participants_collapsible', {
      'was_open': openParticipants
    });
    
    setOpenParticipants(!openParticipants)
  }

  const startEditing = (participant) => {
    gtag('event', 'edit_participant_start', {
      'previous_name': participant.nome,
      'id': participant.id
    });

    setEditingId(participant.id)
    setEditedName(participant.nome)
    clearError()
  }

  const saveEdit = () => {
    const formattedName = editedName.trim()
    const isDuplicate = isDuplicateName(formattedName, editingId)
    const isEmpty = formattedName === ''

    gtag('event', 'edit_participant_save', {
      'new_name': formattedName,
      'is_empty': isEmpty,
      'is_duplicate': isDuplicate,
      'id': editingId
    });

    if (isEmpty) {
      setError(t('errors.empty_name'))
      return
    }

    if (isDuplicate) {
      setError(t('errors.duplicate_name'))
      return
    }

    setParticipants(participants.map(p =>
      p.id === editingId ? { ...p, nome: formattedName } : p
    ))
    setEditingId(null)
    setEditedName('')
    clearError()
  }

  const cancelEdit = () => {
    gtag('event', 'edit_participant_cancel', {
      'id': editingId
    });

    setEditingId(null)
    setEditedName('')
    clearError()
  }

  const openDrawTeamsDialog = () => {
    gtag('event', 'draw_teams_dialog_open', {
      'participant_count': participants.length,
      'has_existing_teams': teams.length > 0
    });
    setOpenDrawDialog(true)
  }

  const cancelDrawTeams = () => {
    gtag('event', 'draw_teams_cancel');
    setOpenDrawDialog(false)
  }

  const drawTeams = (keepTeamId = null) => {
    // Convert participants objects to strings for calculateTeams
    const participantNames = participants.map(p => p.nome)
    const teamNames = teams.map(team => team.map(p => p.nome))
    const benchNames = benchPlayers.map(p => p.nome)
    
    const { formedTeams, remainingPlayers } = calculateTeams({
      participants: participantNames, 
      teams: teamNames, 
      benchPlayers: benchNames,
      keepTeamId: keepTeamId
    })

    // Convert back to objects with IDs
    const formedTeamsWithIds = formedTeams.map(team => 
      team.map(name => participants.find(p => p.nome === name) || { id: Date.now().toString(), nome: name })
    )
    const remainingPlayersWithIds = remainingPlayers.map(name => 
      participants.find(p => p.nome === name) || { id: Date.now().toString(), nome: name }
    )

    const keepTeamAction = keepTeamId === 0 ? 'keep_red' : keepTeamId === 1 ? 'keep_blue' : 'redraw_all'
    
    gtag('event', 'draw_team', {
      'participant_count': participants.length,
      'new_teams_count': formedTeamsWithIds.length,
      'new_bench_players_count': remainingPlayersWithIds.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length,
      'keep_team_action': keepTeamAction,
      'keep_team_id': keepTeamId
    });

    setTeams(formedTeamsWithIds)
    setBenchPlayers(remainingPlayersWithIds)
    clearError()
    setOpenDrawDialog(false)

    // Save teams to localStorage
    saveDataToStorage(LOCAL_STORAGE_KEY_TEAMS, formedTeamsWithIds)
    saveDataToStorage(LOCAl_STORAGE_KEY_BENCH, remainingPlayersWithIds)
  }

  const clearDraw = () => {
    gtag('event', 'clear_draw', {
      'participant_count': participants.length,
      'previous_team_count': teams.length,
      'previous_bench_players_count': benchPlayers.length
    });

    setTeams([])
    setBenchPlayers([])
    clearError()
    clearFromStorage(LOCAL_STORAGE_KEY_TEAMS)
    clearFromStorage(LOCAl_STORAGE_KEY_BENCH)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <AlertDialog open={openClearDialog} onOpenChange={setOpenClearDialog}>
        <AlertDialog open={openDrawDialog} onOpenChange={setOpenDrawDialog}>
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
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="text"
                      placeholder={t('participants.placeholder')}
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value)
                        clearError()
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button
                      onClick={addParticipant}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                    >
                      <span className="block sm:hidden text-xl">+</span>
                      <span className="hidden sm:block">{t('participants.add')}</span>
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={clearAllParticipantsStart}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
                        disabled={participants.length === 0}
                      >
                        <Trash className="w-4 h-4" />
                        <span className="hidden md:inline ms-2">
                          {t('participants.clear_all')}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                  </div>

                  <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">{t('dialog.clear_participants.title')}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-gray-300">
                      {t('dialog.clear_participants.description')}
                    </AlertDialogDescription>
                    <AlertDialogAction onClick={clearAllParticipants} className="bg-red-600 hover:bg-red-700">
                      {t('dialog.clear_participants.confirm')}
                    </AlertDialogAction>
                    <AlertDialogCancel onClick={clearAllParticipantsCancel} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                      {t('dialog.clear_participants.cancel')}
                    </AlertDialogCancel>
                  </AlertDialogContent>

                  {/* Participants List */}
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        {editingId === participant.id ? (
                          <div className="flex gap-2 flex-1">
                            <Input
                              type="text"
                              value={editedName}
                              onChange={(e) => {
                                setEditedName(e.target.value)
                                clearError()
                              }}
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                              className="bg-gray-600 border-gray-500 text-white"
                            />
                            <Button
                              onClick={saveEdit}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {t('participants.save')}
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              size="sm"
                              variant="outline"
                              className="border-gray-500 text-gray-300 hover:bg-gray-600"
                            >
                              {t('participants.cancel')}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="text-white">{participant.nome}</span>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => startEditing(participant)}
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-gray-300 hover:bg-gray-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => removeParticipant(participant.id)}
                                size="sm"
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Badge variant="secondary" className="bg-gray-700 text-white">
                      {t('participants.total', { count: participants.length })}
                    </Badge>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <AlertDialogTrigger asChild>
              <Button
                onClick={openDrawTeamsDialog}
                disabled={participants.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Shuffle className="w-5 h-5 me-2" />
                {t('actions.draw_teams')}
              </Button>
            </AlertDialogTrigger>
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
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white text-center text-xl">
                {t('dialog.draw_teams.title')}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-gray-300 text-center mb-4">
              {t('dialog.draw_teams.description')}
            </AlertDialogDescription>
            <div className="flex flex-col gap-3">
              {teams.length > 0 && (
                <>
                  <Button
                    onClick={() => drawTeams(0)}
                    className="bg-red-600 hover:bg-red-700 text-white w-full py-6 text-lg font-semibold"
                  >
                    {t('dialog.draw_teams.keep_red')}
                  </Button>
                  <Button
                    onClick={() => drawTeams(1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 text-lg font-semibold"
                  >
                    {t('dialog.draw_teams.keep_blue')}
                  </Button>
                </>
              )}
              <Button
                onClick={() => drawTeams(null)}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-6 text-lg font-semibold"
              >
                {t('dialog.draw_teams.redraw_all')}
              </Button>
              <AlertDialogCancel 
                onClick={cancelDrawTeams}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full py-6 text-lg"
              >
                {t('dialog.draw_teams.cancel')}
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>

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
                    <Card key={index} className="bg-gray-800 border-gray-700">
                      <CardHeader
                        className="text-center"
                        style={{ backgroundColor: teamColor.color }}
                      >
                        <CardTitle
                          className="text-xl font-bold"
                          style={{ color: teamColor.textColor }}
                        >
                          {t('results.team', { color: teamColor.name })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {team.map((participant, idx) => (
                            <div
                              key={participant.id}
                              className="bg-gray-700 p-2 rounded text-center text-white"
                            >
                              {idx + 1}. {participant.nome}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-center">
                          <Badge
                            className="text-white"
                            style={{ backgroundColor: teamColor.color }}
                          >
                            {t('results.players_count', { count: team.length })}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Bench Players */}
              {benchPlayers.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="text-center bg-orange-600">
                    <CardTitle className="text-xl font-bold text-white">
                      {t('results.bench_title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {benchPlayers.map((participant) => (
                        <div
                          key={participant.id}
                          className="bg-gray-700 p-2 rounded text-center text-white"
                        >
                          {participant.nome}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center">
                      <Badge className="bg-orange-600 text-white">
                        {t('results.bench_count', { count: benchPlayers.length })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </AlertDialog>
        </AlertDialog>
      </div>
    </div>
  )
}

export default App

