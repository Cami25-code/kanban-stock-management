import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomTabBar from './BottomTabBar';
import './AppLayout.css';

const ICON_DASHBOARD = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ICON_INVENTORY = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
    <polyline points="3 8 12 13 21 8" />
    <line x1="12" y1="13" x2="12" y2="22" />
  </svg>
);

const ICON_ORDERS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const ICON_MORE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const MORE_ITEMS = [
  { key: 'suppliers', label: 'Suppliers' },
  { key: 'reports', label: 'Reports' },
  { key: 'manage-store', label: 'Manage Store' },
];

const ROUTE_MAP = {
  dashboard: '/',
  inventory: '/inventory',
  orders: '/orders',
  suppliers: '/suppliers',
  reports: '/reports',
  'manage-store': '/manage-store',
};

function AppLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const tabItems = [
    { key: 'dashboard', label: 'Dashboard', icon: ICON_DASHBOARD, active: pathname === '/' },
    { key: 'inventory', label: 'Inventory', icon: ICON_INVENTORY, active: pathname.startsWith('/inventory') },
    { key: 'orders',    label: 'Orders',    icon: ICON_ORDERS,    active: pathname === '/orders' },
    { key: 'more',      label: 'More',      icon: ICON_MORE,      active: false },
  ];

  const handleTabSelect = (key) => {
    const route = ROUTE_MAP[key];
    if (route) navigate(route);
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="app-layout__main">
          <Topbar onSearch={onSearch} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="app-layout__content">{children}</main>
        </div>
      </div>
      <BottomTabBar
        items={tabItems}
        onSelect={handleTabSelect}
        moreItems={MORE_ITEMS}
        onSelectMore={handleTabSelect}
      />
    </>
  );
}

export default AppLayout;
