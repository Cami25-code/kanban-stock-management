import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authTokenState } from '../state/atoms';

function ProtectedRoute({ children }) {
  const authToken = useRecoilValue(authTokenState);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
