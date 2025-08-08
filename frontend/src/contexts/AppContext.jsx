import { createContext, useState, useMemo } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [rsvpData, setRsvpData] = useState(null);
  const [comments, setComments] = useState([]);

  const value = useMemo(() => ({
    rsvpData,
    setRsvpData,
    comments,
    setComments
  }), [rsvpData, comments]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}