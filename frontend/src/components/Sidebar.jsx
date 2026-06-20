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
  { label: 'Reports', to: null },
  { label: 'Suppliers', to: '/suppliers' },
  { label: 'Orders', to: null },
  { label: 'Manage Store', to: null },
];

function Sidebar() {
  const resetAuthToken = useResetRecoilState(authTokenState);
  const resetCurrentUser = useResetRecoilState(currentUserState);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // le token est de toute façon effacé côté client
    }
    resetAuthToken();
    resetCurrentUser();
    toast.success('Déconnexion réussie');
  };

  return (
    <aside className="sidebar">
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
              onClick={() => toast.info('Disponible dans une prochaine étape')}
            >
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__link sidebar__link--inert"
          onClick={() => toast.info('Disponible dans une prochaine étape')}
        >
          Settings
        </button>
        <button type="button" className="sidebar__link" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
