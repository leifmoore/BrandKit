import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useDarkMode } from './hooks/useDarkMode'

export default function App() {
  useDarkMode()
  return <RouterProvider router={router} />
}
