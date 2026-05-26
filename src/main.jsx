import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routerApp } from './routes/routerApp'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={createBrowserRouter(routerApp)} />
  </StrictMode>,
)

