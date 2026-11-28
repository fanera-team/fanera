import { createBrowserRouter, Navigate } from 'react-router'
import { AuthGuard, GuestGuard } from '@/features/auth'
import { BoardsPage } from '@/pages/boards'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [{ path: '/boards', element: <BoardsPage /> }],
  },
  { path: '*', element: <Navigate to="/boards" replace /> },
])
