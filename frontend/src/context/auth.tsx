import React, { useReducer, createContext, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  exp: number; 
  [key: string]: any;
}

interface User {
  token: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

interface AuthProviderProps {
  children: ReactNode;
}
const initialState: AuthState = {
  user: null,
};

if (localStorage.getItem('jwtToken')) {
  const token = localStorage.getItem('jwtToken')!;
  const decodedToken = jwtDecode<DecodedToken>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = { token, ...decodedToken };
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: User) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
