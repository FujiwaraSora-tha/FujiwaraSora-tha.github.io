import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safe window.alert override for sandboxed iframes
try {
  window.alert = function (message) {
    console.log("Alert intercepted:", message);
  };
} catch (e) {
  // Ignore errors to ensure no crash in any strict environment
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
