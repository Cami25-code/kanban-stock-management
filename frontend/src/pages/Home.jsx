import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state/atoms';
import AppLayout from '../components/AppLayout';
import './Home.css';

function Home() {
  const currentUser = useRecoilValue(currentUserState);

  return (
    <AppLayout>
      <div className="home">
        <h1>Bienvenue, {currentUser?.name}</h1>
        <p>Le tableau de bord complet arrivera au Ticket 7.</p>
      </div>
    </AppLayout>
  );
}

export default Home;
