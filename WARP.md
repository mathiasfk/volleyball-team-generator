# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based volleyball team drawing application ("Sorteio de Times de Vôlei") that automatically sorts players into fair teams. The app uses a Brazilian Portuguese interface and implements specific volleyball team formation logic.

## Development Commands

### Essential Development Commands
```bash
# Start development server (runs on http://localhost:5173)
pnpm run dev

# Build for production
pnpm run build

# Lint the codebase
pnpm run lint

# Preview production build locally
pnpm run preview

# Install dependencies (if needed)
pnpm install
```

### Testing Commands
This project does not currently have automated tests configured.

## Technology Stack

- **Frontend Framework**: React 19.1.0 with JSX
- **Build Tool**: Vite 6.3.5
- **Package Manager**: pnpm (version 10.4.1+)
- **Styling**: Tailwind CSS 4.1.7 with custom CSS variables
- **UI Components**: Shadcn/UI components (configured for non-RSC, JSX mode)
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Additional Libraries**: 
  - Date manipulation: date-fns
  - Class utilities: clsx, tailwind-merge
  - Toast notifications: sonner

## Code Architecture

### File Structure
```
src/
├── App.jsx              # Main application component (all business logic)
├── App.css              # Tailwind imports and theme configuration
├── main.jsx             # React application entry point
├── index.css            # Empty CSS file
├── lib/
│   └── utils.js         # Utility function for className merging (cn)
└── components/ui/       # Shadcn/UI components (30+ components)
```

### Architecture Pattern
This is a **single-component application** with all state and logic centralized in `App.jsx`. The architecture is:

- **Monolithic Component**: All application state, business logic, and UI rendering happens in the main `App` component
- **UI Component Library**: Uses pre-built Shadcn/UI components for consistent styling
- **State Management**: Uses React's built-in useState hooks for local state management
- **No Routing**: Single-page application without navigation

### Key Application Logic

#### Team Formation Algorithm
The core business logic implements specific volleyball team formation rules:

1. **< 12 players**: Divide equally into teams (minimum 2 teams)
2. **≥ 12 players**: Form teams of exactly 6 players, with remaining players marked as "de fora" (out/bench)

#### State Structure
```javascript
const [participantes, setParticipantes] = useState([])     // Array of {id, nome}
const [times, setTimes] = useState([])                     // Array of player arrays
const [pessoasDeFora, setPessoasDeFora] = useState([])     // Array of remaining players
const [novoNome, setNovoNome] = useState('')              // Form input
const [editandoId, setEditandoId] = useState(null)        // Currently editing player ID
const [nomeEditado, setNomeEditado] = useState('')        // Edit form input
```

#### Team Colors
Pre-defined team colors with Portuguese names:
- Vermelho (Red): #ef4444
- Azul (Blue): #3b82f6  
- Verde (Green): #22c55e
- Roxo (Purple): #a855f7
- Laranja (Orange): #f97316
- Rosa (Pink): #ec4899

## Styling System

### Theme Configuration
- Uses CSS custom properties for theming with light/dark mode support
- Tailwind CSS 4.x with custom color variables defined in `App.css`
- Hard-coded dark theme in the application (bg-gray-900, text-white)

### Component Styling Patterns
- Cards: `bg-gray-800 border-gray-700` for dark theme consistency
- Inputs: `bg-gray-700 border-gray-600 text-white placeholder-gray-400`
- Buttons: Color-coded by function (blue for add, green for save, red for delete)

## Development Guidelines

### Component Development
- All new UI components should use the existing Shadcn/UI pattern
- Maintain the dark theme color scheme throughout the application
- Follow the existing Portuguese naming conventions for user-facing text

### State Management
- Keep all application state in the main App component
- Use descriptive Portuguese variable names that match the domain (participantes, times, etc.)
- Maintain immutable state updates using spread operators

### Styling Approach
- Use Tailwind utility classes for styling
- Leverage the cn() utility function from `src/lib/utils.js` for conditional classes
- Stick to the established gray-scale dark theme palette

### Form Handling
- Use controlled components with React state
- Implement Enter key support for form submissions
- Provide inline editing capabilities following the existing pattern

## Local Development Notes

- The application runs on port 5173 by default (Vite's default)
- Hot reload is enabled for rapid development
- ESLint is configured with React-specific rules
- The app uses pnpm workspaces and has a lockfile committed

## Build Configuration

- **Vite Config**: Uses React plugin and Tailwind CSS plugin
- **Path Aliases**: `@/` maps to `src/` directory
- **JSConfig**: Configured for path mapping support in VS Code/IDEs
- **ESLint**: Configured for React 19, JSX, and modern JavaScript features