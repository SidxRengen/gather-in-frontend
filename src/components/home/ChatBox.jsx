import React, { useEffect, useRef, useState } from "react";
import ChatFooter from "./ChatFooter";
import ChatMessage from "./ChatMessage";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import authServices from "@/services/authServices";
import { messageServices } from "@/services/messageServices";
import { toast } from "sonner";
// import SockJS from "sockjs-client";

function ChatBox({ currentChatUser }) {
  const bottomRef = useRef(null);
  const stompRef = useRef(null);
  const [connected, setConnected] = useState(false);
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
    getUserMessages();
  }, [currentChatUser]);
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentChatUser?.email) return;
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    stompRef.current = client;

    client.connect({}, () => {
      setConnected(true);

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
        setMessages((prev) => [...prev, message]);
      });
    });

    return () => {
      setConnected(false);
      client.disconnect();
      stompRef.current = null;
    };
  }, [currentChatUser.email]);

  const sendMessage = (text) => {
    if (!connected || !stompRef.current) {
      console.warn("STOMP not connected");
      return;
    }

    stompRef.current.send(
      "/app/chat/send",
      {},
      JSON.stringify({
        content: text,
        receiverEmail: currentChatUser.email,
        senderEmail: currentEmail,
      })
    );

    console.log(
      JSON.stringify({
        content: text,
        receiverEmail: currentChatUser.email,
        senderEmail: currentEmail,
      })
    );
  };

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
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center">
        <ChatFooter sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default ChatBox;
