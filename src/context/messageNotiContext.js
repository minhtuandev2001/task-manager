const { createContext, useState, useContext } = require("react");

const MessageContext = createContext();

export function MessageProvider(props) {
  const [countMessageUnRead, setCountMessageUnRead] = useState(null);
  return <MessageContext.Provider value={{ countMessageUnRead, setCountMessageUnRead }} {...props}></MessageContext.Provider>
}

export const useMessageNoti = () => useContext(MessageContext)