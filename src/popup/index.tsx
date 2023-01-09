import React from 'react'
import ReactDOM from 'react-dom/client'
import '../utils/i18n'
import '../styles/globals.css'
import Popup from './Popup'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
