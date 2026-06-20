import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'sonner';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <Toaster richColors position="top-right" />
    <App />
  </RecoilRoot>
);
