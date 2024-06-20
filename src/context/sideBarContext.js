const { createContext, useState, useContext } = require("react");

const SiderContext = createContext();

export function SideBarProvider(props) {
  const [showSideBar, setShowSideBar] = useState(false);
  return <SiderContext.Provider value={{ showSideBar, setShowSideBar }} {...props}></SiderContext.Provider>
}

export const useSideBar = () => useContext(SiderContext)