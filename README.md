# 🏐 Sorteio de Times de Vôlei

Uma aplicação web moderna para sortear times de vôlei de forma automática e justa.

## ✨ Funcionalidades

- **Gerenciar Participantes**: Adicione, edite e remova participantes facilmente
- **Sorteio Inteligente**: Algoritmo que divide automaticamente os participantes em times
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Tema Escuro**: Interface moderna com tema escuro
- **Cores Vibrantes**: Times identificados por cores distintas (Vermelho, Azul, Verde, etc.)

## 🎯 Lógica de Sorteio

### Menos de 12 participantes
- Divide igualmente em times
- Exemplo: 10 pessoas → 2 times de 5 cada

### 12 ou mais participantes
- Cria times de 6 jogadores
- 12-17 pessoas: 2 times de 6 + pessoas "de fora"
- 18-23 pessoas: 3 times de 6 + pessoas "de fora"
- E assim por diante...

### Exemplo prático
- **14 pessoas**: 2 times de 6 jogadores + 2 pessoas "de fora"
- **18 pessoas**: 3 times de 6 jogadores cada
- **20 pessoas**: 3 times de 6 jogadores + 2 pessoas "de fora"

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- pnpm (ou npm/yarn)

### Instalação e Execução

1. **Navegue até o diretório do projeto**:
   ```bash
   cd sorteio-volei
   ```

2. **Instale as dependências** (se necessário):
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   pnpm run dev
   ```

4. **Acesse a aplicação**:
   Abra seu navegador e vá para `http://localhost:5173`

## 📱 Como Usar

### Adicionando Participantes
1. Digite o nome do participante no campo "Nome do participante"
2. Clique em "Adicionar" ou pressione Enter
3. O participante aparecerá na lista abaixo

### Editando Participantes
1. Clique no ícone de lápis (✏️) ao lado do nome
2. Modifique o nome no campo que aparece
3. Clique em "Salvar" para confirmar ou "Cancelar" para descartar

### Removendo Participantes
1. Clique no ícone de lixeira (🗑️) ao lado do nome
2. O participante será removido imediatamente

### Sorteando Times
1. Adicione pelo menos 2 participantes
2. Clique no botão "Sortear Times"
3. Os times aparecerão abaixo com cores distintas
4. Se houver pessoas "de fora", elas aparecerão em uma seção separada

### Limpando o Sorteio
- Clique em "Limpar Sorteio" para remover o resultado e fazer um novo sorteio

## 🎨 Características Visuais

- **Tema Escuro**: Interface moderna e confortável para os olhos
- **Cores dos Times**: 
  - Time Vermelho (#ef4444)
  - Time Azul (#3b82f6)
  - Time Verde (#22c55e)
  - Time Roxo (#a855f7)
  - Time Laranja (#f97316)
  - Time Rosa (#ec4899)
- **Responsivo**: Adapta-se automaticamente a diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- **React**: Framework JavaScript para interface de usuário
- **Vite**: Ferramenta de build rápida e moderna
- **Tailwind CSS**: Framework CSS para estilização
- **Shadcn/UI**: Componentes de interface pré-construídos
- **Lucide Icons**: Ícones modernos e limpos

## 📝 Estrutura do Projeto

```
sorteio-volei/
├── src/
│   ├── components/ui/     # Componentes de interface
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos da aplicação
│   └── main.jsx          # Ponto de entrada
├── public/               # Arquivos públicos
├── package.json          # Dependências do projeto
└── README.md            # Este arquivo
```

## 🤝 Contribuindo

Esta aplicação foi desenvolvida para ser simples e eficaz. Sugestões de melhorias são sempre bem-vindas!

---

**Desenvolvido com ❤️ para facilitar a organização de jogos de vôlei!**

