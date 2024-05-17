import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";
import { AuthContext } from "./authContext"

const SocketContext = createContext();

export const SocketProvider = (props) => {
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) {
      socket.connect();
      socket.emit("setup", currentUser);
      socket.on("connected", () => {
        console.log("connected socket");
      })
    }
    return () => {
      socket.disconnect();
    };
  }, [currentUser])
  return <SocketContext.Provider {...props} value={socket}></SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);