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

  const logout = async () => {
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
    }
  };

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
