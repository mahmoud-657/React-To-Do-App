import React from "react";
import { createContext, useState, useEffect } from "react";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
  let [token, setToken] = useState("");

  useEffect(() => {
    let savedToken = localStorage.getItem("userToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ token, setToken }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
