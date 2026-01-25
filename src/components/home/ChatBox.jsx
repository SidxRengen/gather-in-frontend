import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function ChatBox({ currentChatUser, isGroup, setGroupInfo, setNotifications }) {
  const { profile } = useUserContext();
  const messageContext = useMessageProvider();
  const groupContext = useGroupMessageProvider();
  const currentEmail = authServices?.getCurrentUser()?.email;

  console.log("isGroup", isGroup);
  const newMessage = !isGroup
    ? messageContext?.newMessage
    : groupContext?.newMessage;
  const sendMessage = !isGroup
    ? messageContext?.sendMessage
    : groupContext?.sendMessage;

  const bottomRef = useRef(null);

  useEffect(() => {
    const msg = !isGroup
      ? messageContext?.newMessage
      : groupContext?.newMessage;

    if (!msg || !msg.senderEmail) return;
    if (msg?.senderEmail === currentEmail) return;

    const notification = {
      id: `${msg?.senderEmail}-${Date.now()}`,
      message: msg?.content,
      senderEmail: msg?.senderEmail,
      senderUserName: msg?.senderUserName,
      photo: msg?.photo ?? null,
      groupName: isGroup ? msg?.groupName : null,
      isGroup,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [...prev, notification]);
  }, [
    messageContext?.newMessage,
    groupContext?.newMessage,
    currentEmail,
    isGroup,
  ]);
  const [messages, setMessages] = useState([]);
  console.log(currentChatUser);

  const getUserMessages = async () => {
    try {
      const { message, success, data } = await messageServices.getMessages(
        currentChatUser?.email,
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
        console.log("response1?.data", response1);
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
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages.length]);
  console.log("messages", messages);
  return (
    <div className="flex pt-3 flex-col h-[calc(100dvh-56px)] md:h-[calc(100vh-64px)]">
      <div className="flex-1 px-3 md:px-4 overflow-y-auto pb-[100px] flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex w-full justify-center items-center text-sm text-gray-400 py-6">
            No messages yet. Say hello 👋
          </div>
        ) : isGroup ? (
          messages.map(
            (message, index) =>
              message && (
                <ChatMessage
                  key={index}
                  image={message?.image}
                  right={message?.senderEmail === currentEmail}
                  message={message?.content}
                  userName={message?.senderUserName}
                  timestamp={message?.timestamp}
                  photo={message?.photo}
                />
              ),
          )
        ) : (
          messages.map(
            (message, index) =>
              message && (
                <ChatMessage
                  key={index}
                  image={message?.image}
                  right={message?.senderEmail === currentEmail}
                  message={message?.content}
                  userName={message?.senderUserName}
                  timestamp={message?.timestamp}
                  photo={
                    message?.senderEmail === currentEmail
                      ? profile?.photo
                      : currentChatUser?.photo
                  }
                />
              ),
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="">
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
