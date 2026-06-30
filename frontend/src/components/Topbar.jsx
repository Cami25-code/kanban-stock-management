import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state/atoms';
import './Topbar.css';

/**
 * Topbar — header bar with search and account avatar.
 * Account sheet state is managed by AppLayout; only a callback is needed here.
 */
function Topbar({ onSearch, onMenuClick, onAvatarClick }) {
  const currentUser = useRecoilValue(currentUserState);
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
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
        onClick={onAvatarClick}
        aria-label="Account menu"
        aria-haspopup="dialog"
      >
        {currentUser?.name?.charAt(0).toUpperCase() || '?'}
      </button>
    </header>
  );
}

export default Topbar;
