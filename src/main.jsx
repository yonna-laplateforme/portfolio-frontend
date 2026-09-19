import '@fontsource-variable/fraunces';                  // serif droite
import '@fontsource-variable/fraunces/wght-italic.css'; // serif italique (le « Agency » !)
import '@fontsource-variable/inter';                     // texte
import '@fontsource/space-mono';                         // labels mono
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import App from './App.jsx';
import './index.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);