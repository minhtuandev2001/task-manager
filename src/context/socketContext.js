import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";
import { AuthContext } from "./authContext"
import { BASE_URL } from "../constans/url";
import axios from "axios";

const SocketContext = createContext();

export const SocketProvider = (props) => {
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) {
      socket.connect();
      socket.emit("setup", currentUser);
      socket.on("connected", () => {
        console.log("check ", currentUser.token)
        console.log("connected socket");
        axios.patch(`${BASE_URL}/user/change-status-online`, {
          statusOnline: true,
        }, {
          headers: {
            "Authorization": `Bearer ${currentUser.token}`
          }
        }).then((res) => {
          console.log("check ", res)
          socket.emit("client send statusOnline", currentUser.id, currentUser.statusOnline)
        })
          .catch((err) => {
            console.log("check ", err)
          })
      })
    }
    return () => {
      socket.disconnect();
    };
  }, [currentUser])
  return <SocketContext.Provider {...props} value={socket}></SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);