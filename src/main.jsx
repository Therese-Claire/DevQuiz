/**
 * Main entry point for DevQuiz Admin Dashboard
 * Renders the App component into the DOM
 */

// React core imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global styles import
import './index.css'

// Main App component
import App from './App.jsx'

// Create root and render application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
