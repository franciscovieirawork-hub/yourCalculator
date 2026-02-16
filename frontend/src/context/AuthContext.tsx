import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl } from '../config';

export interface UserProfile {
  id: string;
  userId: string;
  taxSituation: string | null;
  numberOfDependents: number;
  irsRegime: string | null;
  region: string | null;
  adse: boolean;
  irsJovem: boolean;
  mealAllowance: number | null;
  mealAllowanceTaxFree: boolean;
  twelfthHoliday: boolean;
  twelfthChristmas: boolean;
  selfEmployed: boolean;
  activityCode: string | null;
  firstYearActivity: boolean;
  municipality: string | null;
  municipalityTaxRate: number | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  profile: UserProfile | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (password: string, email?: string, phoneNumber?: string) => Promise<void>;
  register: (email: string, password: string, name?: string, securityQuestion?: string, securityAnswer?: string, phoneNumber?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'yc_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: true,
  });

  const fetchUser = useCallback(async (token: string) => {
    const res = await fetch(apiUrl('/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  }, []);

  useEffect(() => {
    const token = state.token;
    if (!token) {
      setState((s) => ({ ...s, user: null, loading: false }));
      return;
    }
    fetchUser(token)
      .then((user) => setState((s) => ({ ...s, user, loading: false })))
      .catch(() => setState((s) => ({ ...s, user: null, token: null, loading: false })));
  }, [state.token, fetchUser]);

  const login = async (password: string, email?: string, phoneNumber?: string) => {
    const res = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phoneNumber, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao iniciar sessão');
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, loading: false });
  };

  const register = async (email: string, password: string, name?: string, securityQuestion?: string, securityAnswer?: string, phoneNumber?: string) => {
    const res = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, securityQuestion, securityAnswer, phoneNumber }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao registar');
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, loading: false });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, loading: false });
  };

  const refreshUser = async () => {
    if (!state.token) return;
    const user = await fetchUser(state.token);
    setState((s) => ({ ...s, user }));
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
