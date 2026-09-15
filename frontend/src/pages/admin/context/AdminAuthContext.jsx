import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ds_admin_jwt') || '');
  const [loading, setLoading] = useState(true);

  // Check current session on initial mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch('/api/admin/me', {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.data) {
            setAdminUser(data.data);
          }
        } else {
          if (isMounted) {
            setAdminUser(null);
            setToken('');
            localStorage.removeItem('ds_admin_jwt');
          }
        }
      } catch (err) {
        if (isMounted) {
          setAdminUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    if (data.data?.token) {
      setToken(data.data.token);
      localStorage.setItem('ds_admin_jwt', data.data.token);
    }
    setAdminUser({ email: data.data.email, role: data.data.role });
    return data.data;
  };

  const [sessionNotice, setSessionNotice] = useState('');

  // Auto-logout after 30 minutes of inactivity (industry standard)
  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

  const updateActivity = () => {
    localStorage.setItem('ds_admin_last_activity', Date.now().toString());
  };

  const logout = async (reason) => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Resilience
    } finally {
      setAdminUser(null);
      setToken('');
      localStorage.removeItem('ds_admin_jwt');
      localStorage.removeItem('ds_admin_last_activity');

      if (reason === 'timeout') {
        sessionStorage.setItem(
          'ds_admin_logout_reason',
          'Your session expired due to 30 minutes of inactivity. Please sign in again.'
        );
        window.location.href = '/admin/login?reason=timeout';
      }
    }
  };

  // Inactivity tracking effect
  useEffect(() => {
    if (!adminUser) return;

    updateActivity();

    // Throttled activity listener
    let lastRecorded = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 10000) {
        // Record at most once every 10 seconds to avoid overhead
        lastRecorded = now;
        updateActivity();
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Periodic check every 15 seconds
    const interval = setInterval(() => {
      const lastActive = Number(localStorage.getItem('ds_admin_last_activity') || Date.now());
      if (Date.now() - lastActive >= INACTIVITY_TIMEOUT_MS) {
        logout('timeout');
      }
    }, 15000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      clearInterval(interval);
    };
  }, [adminUser]);

  const getAuthHeaders = () => {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const value = {
    isAuthenticated: !!adminUser,
    adminUser,
    loading,
    login,
    logout,
    getAuthHeaders,
    sessionNotice,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
