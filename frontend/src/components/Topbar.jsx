import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { logout } from '../api/auth';
import { authTokenState, currentUserState } from '../state/atoms';
import AccountSheet from './AccountSheet';
import './Topbar.css';

function Topbar({ onSearch, onMenuClick }) {
  const currentUser = useRecoilValue(currentUserState);
  const resetAuthToken = useResetRecoilState(authTokenState);
  const resetCurrentUser = useResetRecoilState(currentUserState);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // token cleared client-side regardless
    }
    resetAuthToken();
    resetCurrentUser();
    toast.success('Logged out successfully');
  };

  const handleAccountSelect = (key) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      // both 'settings' and 'profile' resolve to /settings (no separate profile route)
      navigate('/settings');
    }
  };

  return (
    <>
      <header className="topbar">
        <button
          type="button"
          className="topbar__hamburger"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <input
          type="text"
          className="topbar__search"
          placeholder="Search product, supplier, order"
          value={searchValue}
          onChange={handleChange}
        />
        <button
          type="button"
          className="topbar__avatar"
          onClick={() => setIsAccountOpen(true)}
          aria-label="Account menu"
          aria-haspopup="dialog"
        >
          {currentUser?.name?.charAt(0).toUpperCase() || '?'}
        </button>
      </header>
      <AccountSheet
        isOpen={isAccountOpen}
        user={{ name: currentUser?.name || '', email: currentUser?.email || '' }}
        onSelect={handleAccountSelect}
        onClose={() => setIsAccountOpen(false)}
      />
    </>
  );
}

export default Topbar;
