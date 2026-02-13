import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import './index.css'
import { theme } from './theme/theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <CssBaseline />
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
)
