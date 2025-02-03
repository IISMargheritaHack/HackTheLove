import { Navigate } from 'react-router';
import PropTypes from 'prop-types';

const isValidJWT = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const ProtectedRoute = ({ children }) => {
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
