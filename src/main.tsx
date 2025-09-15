import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Simple and direct rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </StrictMode>
  );
}
