// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Impor context yang baru

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

// import { useState, useEffect } from 'react';

// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   profile_picture_url?: string;
// }

// interface AuthState {
//   isLoggedIn: boolean;
//   user: User | null;
//   token: string | null;
// }

// export const useAuth = (): AuthState & {
//   login: (token: string, user: User) => void;
//   logout: () => void;
// } => {
//   const [authState, setAuthState] = useState<AuthState>({
//     isLoggedIn: false,
//     user: null,
//     token: null,
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');
//     if (token && user) {
//       setAuthState({
//         isLoggedIn: true,
//         token,
//         user: JSON.parse(user),
//       });
//     }
//   }, []);

//   const login = (token: string, user: User) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setAuthState({
//       isLoggedIn: true,
//       token,
//       user,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setAuthState({
//       isLoggedIn: false,
//       token: null,
//       user: null,
//     });
//   };

//   return { ...authState, login, logout };
// };
