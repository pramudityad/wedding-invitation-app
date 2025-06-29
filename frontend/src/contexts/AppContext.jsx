import { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [rsvpData, setRsvpData] = useState(null);
  const [comments, setComments] = useState([]);

  return (
    <AppContext.Provider value={{
      rsvpData,
      setRsvpData,
      comments,
      setComments
    }}>
      {children}
    </AppContext.Provider>
  );
}