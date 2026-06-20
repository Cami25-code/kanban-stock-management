import './AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <div className="auth-layout__logo">K</div>
        <span className="auth-layout__brand-name">KANBAN</span>
      </div>
      <div className="auth-layout__form">{children}</div>
    </div>
  );
}

export default AuthLayout;
