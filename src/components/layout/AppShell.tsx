import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/store/ui.store';

export function AppShell() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const location = useLocation();

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />
      <div className="relative flex flex-1 overflow-hidden">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <Sidebar />

        <main className="flex-1 overflow-y-auto animate-fade-in" key={location.pathname}>
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  );
}
