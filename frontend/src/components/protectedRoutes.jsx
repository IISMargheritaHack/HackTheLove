import UserContext from '@provider/userContext';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const isValidJWT = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.email };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (isValidJWT(token)) {
      setUser(getUserFromToken(token));
      setIsAuth(true);
    } else {
      setUser(null);
      setIsAuth(false);
    }
  }, [setUser]);

  if (isAuth === null) {
    return <div>Caricamento...</div>;
  }

  return isAuth ? (children ? children : <Outlet />) : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
