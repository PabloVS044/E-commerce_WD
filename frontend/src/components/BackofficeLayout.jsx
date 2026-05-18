import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function BackofficeLayout() {
  return (
    <div className="min-h-screen bg-[var(--app-surface)]">
      <AppSidebar />
      <div className="min-w-0 lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}
