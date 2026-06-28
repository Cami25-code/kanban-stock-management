import { NavLink } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { logout } from '../api/auth';
import { authTokenState, currentUserState } from '../state/atoms';
import logoIcon from '../assets/logo-kanban-icon.png';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Reports', to: '/reports' },
  { label: 'Suppliers', to: '/suppliers' },
  { label: 'Orders', to: '/orders' },
  { label: 'Manage Store', to: '/manage-store' },
];

function Sidebar({ isOpen, onClose }) {
  const resetAuthToken = useResetRecoilState(authTokenState);
  const resetCurrentUser = useResetRecoilState(currentUserState);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // token is cleared client-side regardless
    }
    resetAuthToken();
    resetCurrentUser();
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Overlay — mobile only, closes the drawer when tapped */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <img src={logoIcon} alt="Kanban" />
          <span>KANBAN</span>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className="sidebar__link sidebar__link--inert"
                onClick={() => toast.info('Coming in a future step')}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="sidebar__footer">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
            }
          >
            Settings
          </NavLink>
          <button type="button" className="sidebar__link" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
