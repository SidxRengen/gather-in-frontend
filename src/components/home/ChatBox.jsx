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
import { groupServices } from "@/services/groupServices";
import { useGroupMessageProvider } from "@/context/GroupMessageProvider";
// import SockJS from "sockjs-client";

function ChatBox({ currentChatUser, isGroup, setGroupInfo }) {
  const { profile } = useUserContext();
  const messageContext = useMessageProvider();
  const groupContext = useGroupMessageProvider();
  console.log("isGroup", isGroup);
  const newMessage = !isGroup
    ? messageContext?.newMessage
    : groupContext?.newMessage;
  const sendMessage = !isGroup
    ? messageContext?.sendMessage
    : groupContext?.sendMessage;

  const bottomRef = useRef(null);
  const currentEmail = authServices?.getCurrentUser()?.email;
  const [messages, setMessages] = useState([]);
  console.log(currentChatUser);

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

  const getGroupData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        groupServices?.getGroupDetails(currentChatUser?.id),
        groupServices.getGroupMessages(currentChatUser?.id),
      ]);
      if (response1?.success) {
        console.log("response1?.data",response1)
        setGroupInfo(response1?.data);
        console.log(response1?.data);
      }
      if (response2?.success) {
        setMessages(response2?.data);
        console.log(response2?.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (newMessage && Object?.keys(newMessage) !== 0) {
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    setMessages([]);
    if (isGroup) {
      groupContext.setGroup(currentChatUser);
      getGroupData();
    } else {
      getUserMessages();
    }
  }, [currentChatUser, isGroup]);
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log("messages", messages);
  return (
    <div className="relative flex flex-col h-[90vh]">
      <div className="flex-1 px-4 overflow-auto flex flex-col gap-3 pb-32">
        {isGroup
          ? messages.map((message, index) => (
              <ChatMessage
                key={index}
                right={message.senderEmail === currentEmail}
                message={message.content}
                userName={message?.senderUserName}
                timestamp={message.timestamp}
                photo={message.photo}
              />
            ))
          : messages.map((message, index) => (
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
          isGroup={isGroup}
          sendMessage={sendMessage}
          groupId={currentChatUser?.id}
          receiverEmail={currentChatUser?.email}
          senderEmail={currentEmail}
        />
      </div>
    </div>
  );
}

export default ChatBox;
