import { useRecoilValue, useResetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { logout } from '../api/auth';
import { authTokenState, currentUserState } from '../state/atoms';
import './Home.css';

function Home() {
  const currentUser = useRecoilValue(currentUserState);
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
    <div className="home">
      <h1>Kanban Stock</h1>
      <p>Connecté en tant que {currentUser?.name} ({currentUser?.email})</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Home;
