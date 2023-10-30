import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function AuthenticatedRoute({ element: Component, ...rest }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the authentication status from the server
    AuthService.isAuthenticated()
      .then(authenticated => {
        setIsAuthenticated(authenticated);
        setIsLoading(false);
        if (!authenticated) {
          // Redirect to login
          navigate('/login', { state: { from: location }, replace: true });
        }
      });
  }, [navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;  // Or some other kind of loading indicator
  }

  // User is authenticated, render the component
  return isAuthenticated ? Component : null;
}

export default AuthenticatedRoute;
