import authServices from "@/services/authServices";
import { Stomp } from "@stomp/stompjs";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";

const MessageContext = createContext();
function MessageProvider({ children }) {
  const currentEmail = authServices?.getCurrentUser()?.email;
  const stompRef = useRef(null);
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL;

    if (!currentEmail) return;
    const socket = new SockJS(url + "/ws");
    const client = Stomp.over(socket);

    stompRef.current = client;

    client.connect({}, () => {
      client.subscribe(`/queue/messages/${currentEmail}`, (msg) => {
        const message = JSON.parse(msg.body);

        if (message?.senderEmail !== currentEmail) {
          toast.info(
            `New message from ${message?.senderUserName}: ${message.content}`,
          );
        }

        setNewMessage(message);
      });
    });

    return () => {
      client.disconnect();
      stompRef.current = null;
    };
  }, [currentEmail]);

  const sendMessage = (text, receiverEmail) => {
    if (!stompRef.current) {
      console.warn("STOMP not connected");
      return;
    }

    stompRef.current.send(
      "/app/chat/send",
      {},
      JSON.stringify({
        content: text,
        receiverEmail,
        senderEmail: currentEmail,
      }),
    );

    console.log(
      JSON.stringify({
        content: text,
        receiverEmail,
        senderEmail: currentEmail,
      }),
    );
  };
  const messageData = {
    newMessage,

    sendMessage,
  };
  return (
    <MessageContext.Provider value={messageData}>
      {children}
    </MessageContext.Provider>
  );
}
export const useMessageProvider = () => {
  return useContext(MessageContext);
};
export default MessageProvider;
