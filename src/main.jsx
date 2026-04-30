import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Removed StrictMode to prevent double-mounting which causes
// the GSAP loading animation to play twice in development.
createRoot(document.getElementById('root')).render(<App />)
