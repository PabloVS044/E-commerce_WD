import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function BackofficeLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(180,106,31,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(100,22,27,0.1),transparent_18%),linear-gradient(180deg,#f7f1ed_0%,#efe7e2_100%)]">
      <AppSidebar />
      <div className="min-w-0 lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}
