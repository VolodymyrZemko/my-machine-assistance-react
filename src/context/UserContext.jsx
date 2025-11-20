import React, { createContext, useContext } from 'react';
import { useUser } from '../modules/user/useUser.js';

const UserContext = createContext(null);
export function UserProvider({ children }) {
  const user = useUser();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export function useUserContext() {
  return useContext(UserContext);
}
