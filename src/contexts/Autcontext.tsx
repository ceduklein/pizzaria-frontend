import { createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { api } from '../services/apiClient';

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  email: string;
  password: string;
  name: string;
}

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    Router.push('/');
  } catch {
    console.log('Erro ao deslogar.')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  async function signIn({ email, password}: SignInProps) {
    try {
      const response = await api.post('/session', { email, password });
      
      const { id, name, token } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mês
        path: "/"
      });

      setUser({ id, name, email });

      // Passar o token com as demais requisições. Definindo default header authorization
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      // Redirecionar usuário para dashboard
      Router.push('/dashboard');

    } catch(err) {
      console.log('Erro: ', err);
    }
  }

  async function signUp({name, email, password}: SignUpProps) {
    try {
      const response = await api.post('/users', { name, email, password });
      Router.push('/');
      
    } catch(err) {
      console.log('Erro: ', err)
    }

  }

  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}