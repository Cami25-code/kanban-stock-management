import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppLayout.css';

function AppLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="app-layout__main">
        <Topbar onSearch={onSearch} onMenuClick={openSidebar} />
        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
