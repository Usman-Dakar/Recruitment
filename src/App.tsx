import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import VacancySearchPage from '@/pages/VacancySearchPage'
import LoginPage from '@/pages/LoginPage'
import InformationPage from '@/pages/InformationPage'
import AboutUsPage from '@/pages/AboutUsPage'
import ContactUsPage from '@/pages/ContactUsPage'
import JobDetailPage from '@/pages/JobDetailPage'
import DashboardPage from '@/pages/DashboardPage'
import MyProfilePage from '@/pages/MyProfilePage'
import MyAccountPage from '@/pages/MyAccountPage'
import InboxPage from '@/pages/InboxPage'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/',                 element: <HomePage /> },
      { path: '/jobs',             element: <VacancySearchPage /> },
      { path: '/jobs/:categoryId', element: <VacancySearchPage /> },
      { path: '/job/:id',          element: <JobDetailPage /> },
      { path: '/login',            element: <LoginPage /> },
      { path: '/information',      element: <InformationPage /> },
      { path: '/about',            element: <AboutUsPage /> },
      { path: '/contact',          element: <ContactUsPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile',   element: <MyProfilePage /> },
          { path: '/account',   element: <MyAccountPage /> },
          { path: '/inbox',     element: <InboxPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
