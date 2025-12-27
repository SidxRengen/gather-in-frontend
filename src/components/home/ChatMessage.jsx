import React from "react";
import { Item, ItemDescription, ItemTitle } from "../ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function ChatMessage({ right, message, userName, photo }) {
  return (
    <div className={`flex w-full ${right && "justify-end"}`}>
      <div
        className={`max-w-[90%] flex gap-2 items-center ${
          right && "flex-row-reverse"
        }`}
      >
        <div
          className={` bg-sidebar-primary flex gap-2 size-6 items-center justify-center rounded-md border`}
        >
          {
            /* <team.logo className="size-3.5 shrink-0" /> */ photo &&
            photo !== "" ? (
              <>
                <img src={photo} alt="user_img" />
              </>
            ) : (
              <span className="text-sm">{userName[0].toUpperCase()}</span>
            )
          }
        </div>
        <Item className={`flex  `} variant="outline">
          {message}
        </Item>
      </div>
    </div>
  );
}

export default ChatMessage;
