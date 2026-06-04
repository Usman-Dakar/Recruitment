import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <Providers />
    </ErrorBoundary>
  </StrictMode>,
);
