import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register Service Worker for PWA with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/capy-inventory/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
        
        // Check for updates every 5 minutes
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);
        
        // Listen for new service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available - auto-activate on next navigation
                console.log('New version available, will update on next visit');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
  
  // Reload when new service worker takes over
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('New service worker active, reloading...');
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
