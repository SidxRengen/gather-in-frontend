import authServices from "@/services/authServices";
import { Stomp } from "@stomp/stompjs";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";

const MessageContext = createContext();
function MessageProvider({ children }) {
  const currentEmail = authServices?.getCurrentUser()?.email;
  const stompRef = useRef(null);
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    if (!currentEmail) return;
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    stompRef.current = client;

    client.connect({}, () => {
      client.subscribe(`/queue/messages/${currentEmail}`, (msg) => {
        const message = JSON.parse(msg.body);
        console.log(
          "message from socket",
          message,
          message?.senderEmail,
          currentEmail
        );
        if (message?.senderEmail !== currentEmail) {
          toast.info(
            "message from " + message?.senderUserName + ": " + message.content
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
    if ( !stompRef.current) {
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
      })
    );

    console.log(
      JSON.stringify({
        content: text,
        receiverEmail,
        senderEmail: currentEmail,
      })
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
