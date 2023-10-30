import { Navigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const PrivateRoute = ({ path, element }) => {
  
  if (AuthService.isAuthenticated()) {
    return element;
  } else {
    return <Navigate to="/login" replace={true} />
  }
};

export default PrivateRoute;