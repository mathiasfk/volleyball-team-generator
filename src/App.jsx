import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Trash2, Edit2, Users, Shuffle, AlertCircle, Trash } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector.jsx'
import useSEO from './hooks/useSEO.js'
import './App.css'

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
    console.log('🔍 Loading data from localStorage...')
    const savedParticipants = localStorage.getItem('volei-participantes')
    
    console.log('📦 Data found:', savedParticipants)
    
    if (savedParticipants) {
      try {
        const parsedData = JSON.parse(savedParticipants)
        console.log('✅ Data loaded successfully:', parsedData)
        setParticipants(parsedData)
      } catch (error) {
        console.error('❌ Error loading participants:', error)
        console.log('🗑️ Clearing corrupted data...')
        localStorage.removeItem('volei-participantes')
      }
    } else {
      console.log('⚠️ No saved data found in localStorage')
    }
    
    // Mark that data has been loaded (or attempt was made)
    setDataLoaded(true)
  }, [])

  // Save participants to localStorage whenever the list changes
  // BUT ONLY after initial data has been loaded
  useEffect(() => {
    if (!dataLoaded) {
      console.log('⏳ Waiting for initial load...')
      return
    }
    
    console.log('💾 Saving participants:', participants)
    try {
      localStorage.setItem('volei-participantes', JSON.stringify(participants))
      console.log('✅ Data saved successfully to localStorage')
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error)
    }
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
    
    if (!formattedName) {
      setError(t('errors.empty_name'))
      return
    }

    if (isDuplicateName(formattedName)) {
      setError(t('errors.duplicate_name'))
      return
    }

    const newParticipant = {
      id: Date.now().toString(),
      nome: formattedName
    }
    setParticipants([...participants, newParticipant])
    setNewName('')
    clearError()
  }

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id))
    clearError()
  }

  const clearAllParticipants = () => {
    setParticipants([])
    setTeams([])
    setBenchPlayers([])
    localStorage.removeItem('volei-participantes')
    clearError()
  }

  const startEditing = (participant) => {
    setEditingId(participant.id)
    setEditedName(participant.nome)
    clearError()
  }

  const saveEdit = () => {
    const formattedName = editedName.trim()
    
    if (!formattedName) {
      setError(t('errors.empty_name'))
      return
    }

    if (isDuplicateName(formattedName, editingId)) {
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
    setEditingId(null)
    setEditedName('')
    clearError()
  }

  const drawTeams = () => {
    if (participants.length === 0) return

    // Draw teams based on number of participants
    // Shuffle all participants randomly
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5)
    
    let formedTeams = []
    let remainingPlayers = []

    if (participants.length < 12) {
      // Less than 12 people: split into 2 teams + 1 on bench
      if (participants.length <= 2) {
        // Very few participants, create only 1 team
        formedTeams.push(shuffledParticipants)
      } else {
        // Split into 2 teams equally, leave 1 out if odd
        const teamSize = Math.floor((participants.length - 1) / 2)
        formedTeams.push(shuffledParticipants.slice(0, teamSize))
        formedTeams.push(shuffledParticipants.slice(teamSize, teamSize * 2))
        
        // If someone left, goes to bench
        if (shuffledParticipants.length > teamSize * 2) {
          remainingPlayers = shuffledParticipants.slice(teamSize * 2)
        }
      }
    } else {
      // 12 or more people: teams of 6 + rest on bench
      const numberOfTeams = Math.floor(participants.length / 6)
      
      for (let i = 0; i < numberOfTeams; i++) {
        const start = i * 6
        const end = start + 6
        formedTeams.push(shuffledParticipants.slice(start, end))
      }
      
      // Remaining people go to bench
      const remaining = participants.length % 6
      if (remaining > 0) {
        remainingPlayers = shuffledParticipants.slice(numberOfTeams * 6)
      }
    }

    setTeams(formedTeams)
    setBenchPlayers(remainingPlayers)
    clearError()
  }

  const clearDraw = () => {
    setTeams([])
    setBenchPlayers([])
    clearError()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">
            {t('app.title')}
          </h1>
          <LanguageSelector />
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
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('participants.manage')}
            </CardTitle>
          </CardHeader>
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t('participants.add')}
              </Button>
              <Button 
                onClick={clearAllParticipants}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                disabled={participants.length === 0}
              >
                <Trash className="w-4 h-4 mr-2" />
                {t('participants.clear_all')}
              </Button>
            </div>

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
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <Button
            onClick={drawTeams}
            disabled={participants.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
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

        {/* Draw Results */}
        {teams.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-400">
              {t('results.title')}
            </h2>
            
            {/* Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}

export default App

