import authServices from "@/services/authServices";
import { messageServices } from "@/services/messageServices";
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
  const [messageLoading, setMessageLoading] = useState(false);
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

  const sendMessage = async (text, receiverEmail, file) => {
    if (!stompRef.current) {
      console.warn("STOMP not connected");
      return;
    }

    setMessageLoading(true);

    try {
      let imageUrl = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const { data, success } = await messageServices.getImageUrl(formData);

        if (success) {
          imageUrl = data?.photoUrl;
        }
      }

      stompRef.current.send(
        "/app/chat/send",
        {},
        JSON.stringify({
          image: imageUrl,
          content: text,
          receiverEmail,
          senderEmail: currentEmail,
        }),
      );

      setTimeout(() => {
        setMessageLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setMessageLoading(false);
    }
  };
  const messageData = {
    newMessage,
    sendMessage,
    messageLoading,
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
