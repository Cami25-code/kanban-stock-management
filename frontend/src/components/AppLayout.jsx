import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppLayout.css';

function AppLayout({ children, onSearch }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <Topbar onSearch={onSearch} />
        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
