import logoFull from '../assets/logo-kanban-full.png';
import './AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <img src={logoFull} alt="Kanban" className="auth-layout__logo" />
      </div>
      <div className="auth-layout__form">{children}</div>
    </div>
  );
}

export default AuthLayout;
