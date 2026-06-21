import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { register } from '../api/auth';
import { authTokenState, currentUserState } from '../state/atoms';
import AuthLayout from '../components/AuthLayout';
import logoIcon from '../assets/logo-kanban-icon.png';
import './AuthForm.css';

function SignUp() {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authTokenState);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await register({ name, email, password });
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.errors?.email?.[0] ||
        error.response?.data?.message ||
        'Error creating account';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src={logoIcon} alt="Kanban" className="auth-form__icon" />
        <h1 className="auth-form__title">Create an account</h1>
        <p className="auth-form__subtitle">Start your 30-day free trial.</p>

        <div className="auth-form__field">
          <label htmlFor="name">Name*</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="email">Email*</label>
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
          <label htmlFor="password">Password*</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          <p className="auth-form__hint">Must be at least 8 characters.</p>
        </div>

        <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Get started'}
        </button>

        <button
          type="button"
          className="auth-form__google"
          onClick={() => toast.info('Feature not available')}
        >
          Sign up with Google
        </button>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default SignUp;
