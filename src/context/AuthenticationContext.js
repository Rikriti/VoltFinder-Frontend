// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthenticationContext = createContext();

// export const AuthenticationProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       setUser('User');
//     }
//     setIsLoading(false);
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('token', token);
//     setIsAuthenticated(true);
//     setUser('User'); 
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <AuthenticationContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
//       {children}
//     </AuthenticationContext.Provider>
//   );
// };

// export const useAuthentication = () => useContext(AuthenticationContext);



import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Install using: npm install jwt-decode

const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
          setUser(decoded); // Store user details
        } else {
          logout(); // Token expired, log out user
        }
      } catch (error) {
        logout(); // Invalid token, clear it
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decoded); // Store decoded user
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
