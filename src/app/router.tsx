import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { SettingsLayout } from '@/features/settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    lazy: () => import('@/pages/LoginPage').then(m => ({ Component: m.default })),
  },
  {
    // All authenticated routes go here
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/home',
            lazy: () => import('@/pages/HomePage').then(m => ({ Component: m.default })),
          },
          {
            path: '/candidates',
            lazy: () => import('@/pages/CandidatesPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/candidates/:id',
            lazy: () => import('@/pages/CandidateProfilePage').then(m => ({ Component: m.default })),
          },
          {
            path: '/jobs',
            lazy: () => import('@/pages/JobsPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/jobs/:id',
            lazy: () => import('@/pages/JobDetailPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/mailbox',
            lazy: () => import('@/pages/MailboxPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/analytics',
            lazy: () => import('@/pages/AnalyticsPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/talent-pools',
            lazy: () => import('@/pages/TalentPoolsPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/talent-pools/:id',
            lazy: () => import('@/pages/TalentPoolDetailPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/acquisitions',
            lazy: () => import('@/pages/AcquisitionsPage').then(m => ({ Component: m.default })),
          },
          {
            path: '/marketplace',
            lazy: () => import('@/pages/MarketplacePage').then(m => ({ Component: m.default })),
          },
          // Settings — nested layout with left-nav sidebar
          {
            path: '/settings',
            element: <SettingsLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/settings/my-account" replace />,
              },
              {
                path: 'my-account',
                lazy: () => import('@/pages/SettingsMyAccountPage').then(m => ({ Component: m.default })),
              },
              {
                path: 'general',
                lazy: () => import('@/pages/SettingsGeneralPage').then(m => ({ Component: m.default })),
              },
              {
                path: 'workflow',
                lazy: () => import('@/pages/SettingsWorkflowPage').then(m => ({ Component: m.default })),
              },
              {
                path: 'templates',
                lazy: () => import('@/pages/SettingsTemplatesPage').then(m => ({ Component: m.default })),
              },
              {
                path: 'plugins',
                lazy: () => import('@/pages/SettingsPluginsPage').then(m => ({ Component: m.default })),
              },
            ],
          },
          // Routes are added here as each module is built (Steps 8–24)
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('@/pages/NotFoundPage').then(m => ({ Component: m.default })),
  },
]);
