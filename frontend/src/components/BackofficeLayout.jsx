import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function BackofficeLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(162,63,0,0.12),transparent_24%),linear-gradient(180deg,#fcf9f8_0%,#f6efed_100%)]">
      <AppSidebar />
      <div className="min-w-0 lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}
