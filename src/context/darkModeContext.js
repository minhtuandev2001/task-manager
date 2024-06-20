import { createContext, useContext, useState } from "react";

const DarkModeContext = createContext()

export const DarkModeProvider = (props) => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('theme')) || false);

  return <DarkModeContext.Provider {...props} value={{ darkMode, setDarkMode }}></DarkModeContext.Provider>
}

export const useDarkMode = () => useContext(DarkModeContext)