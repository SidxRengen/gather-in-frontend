import React from "react";
import { Item, ItemDescription, ItemTitle } from "../ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function ChatMessage({ right, message, userName, photo, timestamp }) {
  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return "yesterday";
    }
    if (isToday) {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };
  return (
    <div className={`flex w-full ${right && "justify-end"}`}>
      <div
        className={`max-w-[90%] flex gap-2 items-center ${
          right && "flex-row-reverse"
        }`}
      >
        <div
          className={` flex gap-2 size-6 items-center justify-center rounded-md border`}
        >
          {
            /* <team.logo className="size-3.5 shrink-0" /> */ photo &&
            photo !== "" ? (
              <>
                <img
                  src={photo}
                  alt="user_img"
                  className="rounded-md h-full w-full object-cover"
                />
              </>
            ) : (
              <span className="text-sm">
                {userName && userName[0]?.toUpperCase()}
              </span>
            )
          }
        </div>

        <Item
          className={`flex flex-col ${
            right ? "items-end" : "items-start"
          } gap-1 backdrop-blur-xs bg-black/20`}
          variant="outline"
        >
          <span className="font-medium ">{message}</span>
          <span className="text-xs  text-gray-300">
            {formatChatTime(timestamp)}
          </span>
        </Item>
      </div>
    </div>
  );
}

export default ChatMessage;
