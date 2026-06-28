import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state/atoms';
import './Topbar.css';

function Topbar({ onSearch, onMenuClick }) {
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
      <div className="topbar__avatar">{currentUser?.name?.charAt(0).toUpperCase() || '?'}</div>
    </header>
  );
}

export default Topbar;
