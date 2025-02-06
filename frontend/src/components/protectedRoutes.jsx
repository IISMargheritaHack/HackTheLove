import UserContext from '@provider/userContext';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

const isValidJWT = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (isValidJWT(token)) {
      const email = JSON.parse(atob(token.split('.')[1])).email;
      setUser({ email });
    } else {
      setUser(null);
    }
  }, [setUser]);

  const token = localStorage.getItem('jwt');

  if (!isValidJWT(token)) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
