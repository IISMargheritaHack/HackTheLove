import { useState, useEffect } from "react";
import UserContext from "@provider/userContext"

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("User stato aggiornato:", user);  // 👀 Monitoraggio globale dello stato utente
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
