/* This components is not a REAL valid protection but a simple, the real auths are maded in the backend */
import { Navigate } from 'react-router';

const isValidJWT = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwt');
  console.log(token);
  console.log(isValidJWT(token));
  if (!isValidJWT(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
