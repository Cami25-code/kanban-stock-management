import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { login } from '../api/auth';
import { authTokenState, currentUserState } from '../state/atoms';
import AuthLayout from '../components/AuthLayout';
import './AuthForm.css';

function Login() {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authTokenState);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      toast.success('Connexion réussie');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Identifiants invalides');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form__title">Log in to your account</h1>
        <p className="auth-form__subtitle">Welcome back! Please enter your details.</p>

        <div className="auth-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__row">
          <label>
            <input type="checkbox" />
            Remember for 30 days
          </label>
          <button
            type="button"
            className="auth-form__link"
            onClick={() => toast.info('Fonctionnalité non disponible')}
          >
            Forgot password
          </button>
        </div>

        <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <button
          type="button"
          className="auth-form__google"
          onClick={() => toast.info('Fonctionnalité non disponible')}
        >
          Sign in with Google
        </button>

        <p className="auth-form__footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
