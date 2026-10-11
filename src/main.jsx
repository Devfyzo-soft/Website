import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships the page already rendered into #root (see scripts/prerender.mjs), so the first
// paint is the real page; React then attaches to it. In `vite dev` #root only holds the loader, so render normally.
if (root.hasAttribute('data-prerendered')) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
