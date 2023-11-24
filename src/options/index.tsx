import React from 'react'
import ReactDOM from 'react-dom/client'
import { ExpireContainer } from './Expire'
import '@/utils/i18n'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ExpireContainer />
  </React.StrictMode>
)
