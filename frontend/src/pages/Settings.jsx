import { useState } from 'react';
import { toast } from 'sonner';
import { useRecoilState } from 'recoil';
import { updateProfile } from '../api/auth';
import { currentUserState } from '../state/atoms';
import AppLayout from '../components/AppLayout';
import './Settings.css';

function Settings() {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [name, setName] = useState(currentUser?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await updateProfile({ name });
      setCurrentUser(response.data);
      toast.success('Profile updated');
    } catch (error) {
      const errors = error.response?.data?.errors;
      toast.error(errors ? Object.values(errors)[0][0] : 'Unable to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSavingPassword(true);

    try {
      await updateProfile({ current_password: currentPassword, password: newPassword });
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errors = error.response?.data?.errors;
      toast.error(errors ? Object.values(errors)[0][0] : 'Unable to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <AppLayout>
      <div className="settings">
        <div className="settings__card">
          <h2>Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input type="email" value={currentUser?.email || ''} disabled />
            </label>

            <button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="settings__card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </label>

            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            <button type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="settings__card">
          <h2>About / Contact</h2>
          <dl className="settings__about">
            <dt>Developed by</dt>
            <dd>Ibrahima Camara</dd>
            <dt>Contact</dt>
            <dd>
              <a href="mailto:Ibrahima.dev@proton.me">Ibrahima.dev@proton.me</a>
            </dd>
            <dt>Link</dt>
            <dd>
              <a href="https://ibrahima-camara.vercel.app" target="_blank" rel="noopener noreferrer">
                ibrahima-camara.vercel.app
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </AppLayout>
  );
}

export default Settings;
