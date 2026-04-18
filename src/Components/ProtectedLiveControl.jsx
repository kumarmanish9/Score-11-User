import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LiveControl from '../Pages/LiveControl';
import { getCurrentUser } from '../Services/AuthServices';
import { ROLES } from '../config/roles'; // Copy roles or use string check

const ProtectedLiveControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData.data);

        // Check roles
        const allowedRoles = ['admin', 'umpire', 'scorer'];
        const hasRole = allowedRoles.includes(userData.data.role);
        setAuthorized(hasRole);

        if (!hasRole) {
          alert('Access denied. Admin/Umpire/Scorer role required.');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading authorization...</div>;
  }

  if (!authorized) {
    return <div>Access denied</div>;
  }

  return <LiveControl />;
};

export default ProtectedLiveControl;

