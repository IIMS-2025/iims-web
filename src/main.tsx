import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/theme.css'
import './styles.css'
import './tailwind.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
