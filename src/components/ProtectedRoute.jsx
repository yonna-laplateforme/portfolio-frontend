import { Navigate } from 'react-router-dom';
// LA CORRECTION EST ICI : on pointe vers AuthProvider
import { useAuth } from '../context/AuthProvider'; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/la-porte-secrete-du-portfolio" />;
};

export default ProtectedRoute;