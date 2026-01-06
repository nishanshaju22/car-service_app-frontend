import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import { SelectedCarProvider } from './context/SelectedCarContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SelectedCarProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SelectedCarProvider>
  </StrictMode>,
)
