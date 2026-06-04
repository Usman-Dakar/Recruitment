import { useLocation } from 'react-router-dom';

export default function SettingsPlaceholderPage() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() ?? 'settings';
  const label = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <p className="text-lg font-medium">{label}</p>
      <p className="text-sm text-muted-foreground mt-1">Coming in the next build step.</p>
    </div>
  );
}
