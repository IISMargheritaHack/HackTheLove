import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  return null;
}
