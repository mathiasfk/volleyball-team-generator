import './index.css'
import './i18n.js'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import DesignSystemPage from './components/DesignSystemPage.jsx'
import MainApp from './components/MainApp.jsx'

// Check if design system page should be shown (via query parameter for dev/internal use)
const urlParams = new URLSearchParams(window.location.search)
const showDesignSystem = urlParams.has('design-system') || urlParams.has('ds')

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    {showDesignSystem ? <DesignSystemPage /> : <MainApp />}
  </StrictMode>,
)
