import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './styles/animations.css';
import { BrowserRouter } from 'react-router-dom';

// SSG/SSR setup for production
export const render = (context: any) => {
  const { isClient } = context;
  const rootElement = isClient ? document.getElementById('root') : null;

  // Client-side rendering
  if (isClient && rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HelmetProvider context={context.helmetContext}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </StrictMode>
    );
  }

  // Server-side rendering
  return (
    <StrictMode>
      <HelmetProvider context={context.helmetContext}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
};

// Standard development entry
if (import.meta.env.DEV) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </StrictMode>
    );
  }
}
