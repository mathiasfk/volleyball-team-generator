import { AlertCircle, CheckCircle2, Palette, Type } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'

const DesignSystemPage = () => {
  // Helper function to read CSS variables
  const getCSSValue = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  }

  // Color palette metadata (only metadata, values read from CSS)
  const colors = [
    { name: 'Text Primary', variable: '--color-text-primary', description: 'Cor principal do texto' },
    { name: 'Text Secondary', variable: '--color-text-secondary', description: 'Cor secundária do texto' },
    { name: 'Error', variable: '--color-error', description: 'Cor para mensagens de erro' },
    { name: 'Success', variable: '--color-success', description: 'Cor para mensagens de sucesso' },
    { name: 'Team Blue', variable: '--color-team-blue', description: 'Cor do time azul' },
    { name: 'Team Red', variable: '--color-team-red', description: 'Cor do time vermelho' },
    { name: 'Primary', variable: '--color-primary', description: 'Cor primária do design' },
    { name: 'Primary Hover', variable: '--color-primary-hover', description: 'Cor primária no estado hover' },
    { name: 'Border', variable: '--color-border', description: 'Cor das bordas' },
    { name: 'Border Highlight', variable: '--color-border-highlight', description: 'Cor das bordas em destaque' },
    { name: 'Card Primary', variable: '--color-card-primary', description: 'Cor do card primário' },
    { name: 'Card Secondary', variable: '--color-card-secondary', description: 'Cor do card secundário' },
    { name: 'Background', variable: '--color-background', description: 'Cor de fundo da aplicação' },
  ]

  // Typography metadata (only metadata, values read from CSS)
  const typography = [
    { name: 'Title', variable: '--text-title', class: 'ds-text-title' },
    { name: 'Emphasis', variable: '--text-emphasis', class: 'ds-text-emphasis' },
    { name: 'Primary', variable: '--text-primary', class: 'ds-text-primary' },
    { name: 'Secondary', variable: '--text-secondary', class: 'ds-text-secondary' },
    { name: 'Small', variable: '--text-small', class: 'ds-text-small' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="ds-text-title">
            Design System
          </h1>
          <p className="ds-text-secondary">
            Documentação e exemplos dos componentes visuais, cores e tipografia do sistema
          </p>
        </div>

        {/* Typography Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Type className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            <h2 className="ds-text-title">
              Tipografia
            </h2>
          </div>
          <Card style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Níveis de Texto</CardTitle>
              <CardDescription>
                Sistema de tipografia padronizado com tamanhos e pesos definidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {typography.map((type) => {
                const fontSize = getCSSValue(type.variable)
                return (
                  <div key={type.name} className="space-y-2 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card-secondary)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="ds-text-emphasis">{type.name}</h3>
                        <p className="ds-text-small">
                          Tamanho: {fontSize} | Classe: <code className="text-xs">{type.class}</code>
                        </p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {type.variable}
                      </Badge>
                    </div>
                    <div className={type.class} style={{ 
                      color: type.name === 'Secondary' || type.name === 'Small' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' 
                    }}>
                      Exemplo de texto usando o estilo {type.name.toLowerCase()}. Lorem ipsum dolor sit amet.
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* Colors Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            <h2 className="ds-text-title">
              Cores
            </h2>
          </div>
          <Card style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Paleta de Cores</CardTitle>
              <CardDescription>
                Todas as cores do sistema definidas em HSL para fácil manutenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color) => {
                  const colorValue = getCSSValue(color.variable)
                  
                  return (
                    <div
                      key={color.name}
                      className="rounded-lg overflow-hidden border"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div
                        className="h-24 w-full"
                        style={{ backgroundColor: colorValue }}
                      />
                      <div className="p-4 space-y-2" style={{ backgroundColor: 'var(--color-card-secondary)' }}>
                        <div>
                          <h3 className="ds-text-emphasis">{color.name}</h3>
                          <p className="ds-text-small">{color.description}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="ds-text-small">
                            <strong>Valor:</strong> {colorValue}
                          </div>
                          <div className="ds-text-small">
                            <strong>Variável:</strong> <code className="text-xs">{color.variable}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Components Section */}
        <section>
          <h2 className="ds-text-title mb-6">
            Componentes
          </h2>

          {/* Buttons */}
          <Card className="mb-6" style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Botões</CardTitle>
              <CardDescription>Variações de botões disponíveis no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card className="mb-6" style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Cards</CardTitle>
              <CardDescription>Exemplos de cards primários e secundários</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
                <CardHeader>
                  <CardTitle className="ds-text-emphasis">Card Primário</CardTitle>
                  <CardDescription>Exemplo de card usando cor primária</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="ds-text-primary">
                    Este é um exemplo de card com a cor primária definida no design system.
                  </p>
                </CardContent>
              </Card>
              <Card style={{ backgroundColor: 'var(--color-card-secondary)', borderColor: 'var(--color-border-highlight)' }}>
                <CardHeader>
                  <CardTitle className="ds-text-emphasis">Card Secundário</CardTitle>
                  <CardDescription>Exemplo de card usando cor secundária</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="ds-text-primary">
                    Este é um exemplo de card com a cor secundária definida no design system.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mb-6" style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Alertas</CardTitle>
              <CardDescription>Mensagens de feedback para o usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este é um exemplo de alerta de erro usando a cor de erro do design system.
                </AlertDescription>
              </Alert>
              <Alert style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Este é um exemplo de alerta de sucesso usando a cor de sucesso do design system.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card style={{ backgroundColor: 'var(--color-card-primary)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
              <CardTitle className="ds-text-emphasis">Elementos de Formulário</CardTitle>
              <CardDescription>Inputs, labels e outros elementos de formulário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="example-input">Label de Exemplo</Label>
                <Input id="example-input" placeholder="Digite algo..." />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge>Badge Padrão</Badge>
                <Badge variant="secondary">Badge Secundário</Badge>
                <Badge variant="destructive">Badge Destrutivo</Badge>
                <Badge variant="outline">Badge Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default DesignSystemPage
