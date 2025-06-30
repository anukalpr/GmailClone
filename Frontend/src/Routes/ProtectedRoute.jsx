import { useAuth } from '../contexts/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/" />;
  }

  return children; 
};

export default ProtectedRoute;
