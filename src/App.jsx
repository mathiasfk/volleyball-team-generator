import { Route,Routes } from 'react-router-dom'

import DesignSystemPage from './components/DesignSystemPage.jsx'
import MainApp from './components/MainApp.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
    </Routes>
  )
}

export default App
