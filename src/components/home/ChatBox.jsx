import React, { useEffect, useRef, useState } from "react";
import ChatFooter from "./ChatFooter";
import ChatMessage from "./ChatMessage";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import authServices from "@/services/authServices";
import { messageServices } from "@/services/messageServices";
import { toast } from "sonner";
import { useMessageProvider } from "@/context/MessageProvider";
import { useUserContext } from "@/context/UsersProvider";
// import SockJS from "sockjs-client";

function ChatBox({ currentChatUser }) {
  const { profile } = useUserContext();
  const { newMessage, sendMessage } = useMessageProvider();
  console.log(newMessage);
  const bottomRef = useRef(null);
  const currentEmail = authServices?.getCurrentUser()?.email;
  const [messages, setMessages] = useState([]);

  const getUserMessages = async () => {
    try {
      const { message, success, data } = await messageServices.getMessages(
        currentChatUser?.email
      );
      if (success) {
        setMessages(data);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (Object.keys(newMessage) !== 0) {
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    getUserMessages();
  }, [currentChatUser]);
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col h-[93vh]">
      <div className="flex-1 px-4 overflow-auto flex flex-col gap-3 pb-32">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            right={message.senderEmail === currentEmail}
            message={message.content}
            userName={message.senderUserName}
            timestamp={message.timestamp}
            photo={
              message.senderEmail === currentEmail
                ? profile?.photo
                : currentChatUser?.photo
            }
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center">
        <ChatFooter
          sendMessage={sendMessage}
          receiverEmail={currentChatUser.email}
        />
      </div>
    </div>
  );
}

export default ChatBox;
