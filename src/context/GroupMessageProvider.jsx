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

const GroupMessageContext = createContext();
function GroupMessageProvider({ children }) {
  const url = import.meta.env.VITE_API_BASE_URL;
  const [group, setGroup] = useState({});

  const stompRef = useRef(null);
  const currentEmail = authServices?.getCurrentUser()?.email;

  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    // console.log("start getting the messages 1")
    if (group?.id === "") return;
    // console.log("start getting the messages 2")
    const socket = new SockJS(url+"/ws");
    const client = Stomp.over(socket);
    stompRef.current = client;

    client.connect({}, () => {
      client.subscribe(`/queue/group/message/${group?.id}`, (msg) => {
        const message = JSON.parse(msg.body);
        if (message.senderEmail !== currentEmail) {
          toast.info(
            `New message from ${message?.senderUserName} in ${group?.userName}: ${message.content}`
          );
        }
        setNewMessage(message);
      });
    });

    // console.log("start getting the messages 3")

    return () => {
      client.disconnect();
      stompRef.current = null;
    };
  }, [group]);

  const sendMessage = (text, groupId) => {
    if (!stompRef.current) {
      console.warn("STOMP not connected");
      return;
    }

    stompRef.current.send(
      "/app/send/group/message",
      {},
      JSON.stringify({
        content: text,
        sender_email: currentEmail,
        group_id: groupId,
      })
    );
  };

  const messageData = {
    newMessage,
    sendMessage,
    setGroup,
  };

  return (
    <GroupMessageContext.Provider value={messageData}>
      {children}
    </GroupMessageContext.Provider>
  );
}
export const useGroupMessageProvider = () => {
  return useContext(GroupMessageContext);
};
export default GroupMessageProvider;
