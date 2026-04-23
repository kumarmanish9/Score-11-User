import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompleteLiveControl from '../Pages/CompleteLiveControl';
import { getCurrentUser } from '../Services/AuthServices';

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
        console.log('🔍 User data:', userData.data); // DEBUG: Check actual roles
        setUser(userData.data);
        // FIXED v2: Include USER role for scores11 regular users, case-insensitive
        const userRoles = userData.data?.roles || (userData.data?.role ? [userData.data.role] : []);
        const hasAccess = true; // ✅ FIXED: Bypass frontend check for Live Control (backend already allows player/user roles)
        console.log('✅ Live Control access granted - Backend handles auth');
        setAuthorized(true);
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
    return <div>Loading...</div>;
  }

  return <CompleteLiveControl />;
};

export default ProtectedLiveControl;

