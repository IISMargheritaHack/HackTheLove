import { Navigate } from 'react-router';
import PropTypes from 'prop-types';
import UserContext from '@provider/userContext';
import { useContext, useEffect } from 'react';

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
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (isValidJWT(token)) {
      const email = JSON.parse(atob(token.split('.')[1])).email;
      console.log("TOKEN VALIDO - EMAIL:", email);
      setUser({ email });
    } else {
      console.log("TOKEN NON VALIDO - Reset user a null");
      setUser(null);
    }
  }, [setUser]);


  const token = localStorage.getItem('jwt');

  if (!isValidJWT(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
