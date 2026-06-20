import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from './api/axios';
import './App.css';

function App() {
  const [pingResult, setPingResult] = useState(null);

  useEffect(() => {
    api
      .get('/ping')
      .then((response) => {
        setPingResult(response.data);
        toast.success('Connexion au back-end réussie');
      })
      .catch(() => {
        setPingResult({ error: true });
        toast.error('Impossible de contacter le back-end');
      });
  }, []);

  return (
    <div className="App">
      <h1>Kanban Stock</h1>
      <p>Test de connexion à l'API : {JSON.stringify(pingResult)}</p>
    </div>
  );
}

export default App;
