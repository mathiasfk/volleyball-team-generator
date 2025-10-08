import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Trash2, Edit2, Users, Shuffle, AlertCircle, Trash } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector.jsx'
import './App.css'

function App() {
  const { t } = useTranslation()
  const [participantes, setParticipantes] = useState([])
  const [novoNome, setNovoNome] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [nomeEditado, setNomeEditado] = useState('')
  const [times, setTimes] = useState([])
  const [pessoasDeFora, setPessoasDeFora] = useState([])
  const [erro, setErro] = useState('')
  const [dadosCarregados, setDadosCarregados] = useState(false)

  // Cores vibrantes para os times
  const coresDosTimes = [
    { nome: t('colors.red'), cor: '#ef4444', corTexto: '#ffffff' },
    { nome: t('colors.blue'), cor: '#3b82f6', corTexto: '#ffffff' },
    { nome: t('colors.green'), cor: '#22c55e', corTexto: '#ffffff' },
    { nome: t('colors.purple'), cor: '#a855f7', corTexto: '#ffffff' },
    { nome: t('colors.orange'), cor: '#f97316', corTexto: '#ffffff' },
    { nome: t('colors.pink'), cor: '#ec4899', corTexto: '#ffffff' }
  ]

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    console.log('🔍 Carregando dados do localStorage...')
    const participantesSalvos = localStorage.getItem('volei-participantes')
    
    console.log('📦 Dados encontrados:', participantesSalvos)
    
    if (participantesSalvos) {
      try {
        const dadosParsed = JSON.parse(participantesSalvos)
        console.log('✅ Dados carregados com sucesso:', dadosParsed)
        setParticipantes(dadosParsed)
      } catch (error) {
        console.error('❌ Erro ao carregar participantes:', error)
        console.log('🗑️ Limpando dados corrompidos...')
        localStorage.removeItem('volei-participantes')
      }
    } else {
      console.log('⚠️ Nenhum dado salvo encontrado no localStorage')
    }
    
    // Marcar que os dados foram carregados (ou tentativa foi feita)
    setDadosCarregados(true)
  }, [])

  // Salvar participantes no localStorage sempre que a lista mudar
  // MAS APENAS depois que os dados iniciais foram carregados
  useEffect(() => {
    if (!dadosCarregados) {
      console.log('⏳ Aguardando carregamento inicial...')
      return
    }
    
    console.log('💾 Salvando participantes:', participantes)
    try {
      localStorage.setItem('volei-participantes', JSON.stringify(participantes))
      console.log('✅ Dados salvos com sucesso no localStorage')
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error)
    }
  }, [participantes, dadosCarregados])

  const limparErro = () => {
    if (erro) setErro('')
  }

  const verificarNomeDuplicado = (nome, idExcluir = null) => {
    return participantes.some(p => 
      p.nome.toLowerCase().trim() === nome.toLowerCase().trim() && 
      p.id !== idExcluir
    )
  }

  const adicionarParticipante = () => {
    const nomeFormatado = novoNome.trim()
    
    if (!nomeFormatado) {
      setErro(t('errors.empty_name'))
      return
    }

    if (verificarNomeDuplicado(nomeFormatado)) {
      setErro(t('errors.duplicate_name'))
      return
    }

    const novoParticipante = {
      id: Date.now().toString(),
      nome: nomeFormatado
    }
    setParticipantes([...participantes, novoParticipante])
    setNovoNome('')
    limparErro()
  }

  const removerParticipante = (id) => {
    setParticipantes(participantes.filter(p => p.id !== id))
    limparErro()
  }

  const limparTodosParticipantes = () => {
    setParticipantes([])
    setTimes([])
    setPessoasDeFora([])
    localStorage.removeItem('volei-participantes')
    limparErro()
  }

  const iniciarEdicao = (participante) => {
    setEditandoId(participante.id)
    setNomeEditado(participante.nome)
    limparErro()
  }

  const salvarEdicao = () => {
    const nomeFormatado = nomeEditado.trim()
    
    if (!nomeFormatado) {
      setErro(t('errors.empty_name'))
      return
    }

    if (verificarNomeDuplicado(nomeFormatado, editandoId)) {
      setErro(t('errors.duplicate_name'))
      return
    }

    setParticipantes(participantes.map(p => 
      p.id === editandoId ? { ...p, nome: nomeFormatado } : p
    ))
    setEditandoId(null)
    setNomeEditado('')
    limparErro()
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setNomeEditado('')
    limparErro()
  }

  const sortearTimes = () => {
    if (participantes.length === 0) return

    // Embaralhar todos os participantes aleatoriamente
    const participantesEmbaralhados = [...participantes].sort(() => Math.random() - 0.5)
    
    let timesFormados = []
    let pessoasRestantes = []

    if (participantes.length < 12) {
      // Menos de 12 pessoas: dividir igualmente em 2 times + 1 de fora
      if (participantes.length <= 2) {
        // Muito poucos participantes, criar apenas 1 time
        timesFormados.push(participantesEmbaralhados)
      } else {
        // Dividir em 2 times igualmente, deixando 1 de fora se ímpar
        const tamanhoTime = Math.floor((participantes.length - 1) / 2)
        timesFormados.push(participantesEmbaralhados.slice(0, tamanhoTime))
        timesFormados.push(participantesEmbaralhados.slice(tamanhoTime, tamanhoTime * 2))
        
        // Se sobrou alguém, fica de fora
        if (participantesEmbaralhados.length > tamanhoTime * 2) {
          pessoasRestantes = participantesEmbaralhados.slice(tamanhoTime * 2)
        }
      }
    } else {
      // 12 ou mais pessoas: times de 6 + resto de fora
      const numeroTimes = Math.floor(participantes.length / 6)
      
      for (let i = 0; i < numeroTimes; i++) {
        const inicio = i * 6
        const fim = inicio + 6
        timesFormados.push(participantesEmbaralhados.slice(inicio, fim))
      }
      
      // Pessoas restantes ficam de fora
      const restantes = participantes.length % 6
      if (restantes > 0) {
        pessoasRestantes = participantesEmbaralhados.slice(numeroTimes * 6)
      }
    }

    setTimes(timesFormados)
    setPessoasDeFora(pessoasRestantes)
    limparErro()
  }

  const limparSorteio = () => {
    setTimes([])
    setPessoasDeFora([])
    limparErro()
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

        {/* Alerta de Erro */}
        {erro && (
          <Alert className="mb-6 bg-red-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {erro}
            </AlertDescription>
          </Alert>
        )}

        {/* Seção de Adicionar Participantes */}
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
                value={novoNome}
                onChange={(e) => {
                  setNovoNome(e.target.value)
                  limparErro()
                }}
                onKeyPress={(e) => e.key === 'Enter' && adicionarParticipante()}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button 
                onClick={adicionarParticipante}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t('participants.add')}
              </Button>
              <Button 
                onClick={limparTodosParticipantes}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                disabled={participantes.length === 0}
              >
                <Trash className="w-4 h-4 mr-2" />
                {t('participants.clear_all')}
              </Button>
            </div>

            {/* Lista de Participantes */}
            <div className="space-y-2">
              {participantes.map((participante) => (
                <div key={participante.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  {editandoId === participante.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        type="text"
                        value={nomeEditado}
                        onChange={(e) => {
                          setNomeEditado(e.target.value)
                          limparErro()
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && salvarEdicao()}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Button 
                        onClick={salvarEdicao}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {t('participants.save')}
                      </Button>
                      <Button 
                        onClick={cancelarEdicao}
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600"
                      >
                        {t('participants.cancel')}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-white">{participante.nome}</span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => iniciarEdicao(participante)}
                          size="sm"
                          variant="outline"
                          className="border-gray-500 text-gray-300 hover:bg-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removerParticipante(participante.id)}
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
                {t('participants.total', { count: participantes.length })}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-center mb-6">
          <Button
            onClick={sortearTimes}
            disabled={participantes.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            {t('actions.draw_teams')}
          </Button>
          {times.length > 0 && (
            <Button
              onClick={limparSorteio}
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-600 px-8 py-3 text-lg"
            >
              {t('actions.clear_draw')}
            </Button>
          )}
        </div>

        {/* Resultado do Sorteio */}
        {times.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-400">
              {t('results.title')}
            </h2>
            
            {/* Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {times.map((time, index) => {
                const corTime = coresDosTimes[index % coresDosTimes.length]
                return (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardHeader 
                      className="text-center"
                      style={{ backgroundColor: corTime.cor }}
                    >
                      <CardTitle 
                        className="text-xl font-bold"
                        style={{ color: corTime.corTexto }}
                      >
                        {t('results.team', { color: corTime.nome })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {time.map((participante, idx) => (
                          <div 
                            key={participante.id} 
                            className="bg-gray-700 p-2 rounded text-center text-white"
                          >
                            {idx + 1}. {participante.nome}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Badge 
                          className="text-white"
                          style={{ backgroundColor: corTime.cor }}
                        >
                          {t('results.players_count', { count: time.length })}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pessoas de Fora */}
            {pessoasDeFora.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="text-center bg-orange-600">
                  <CardTitle className="text-xl font-bold text-white">
                    {t('results.bench_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {pessoasDeFora.map((participante) => (
                      <div 
                        key={participante.id} 
                        className="bg-gray-700 p-2 rounded text-center text-white"
                      >
                        {participante.nome}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <Badge className="bg-orange-600 text-white">
                      {t('results.bench_count', { count: pessoasDeFora.length })}
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

