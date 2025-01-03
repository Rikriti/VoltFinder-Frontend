import React, { createContext, useState } from 'react';

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [userNameContext, setUserNameContext] = useState("random");

  return (
    <UserContext.Provider value={{ userNameContext, setUserNameContext }}>
      {children}
    </UserContext.Provider>
  );
};
