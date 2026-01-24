import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Button } from "../ui/button";
import { Link, ListStart, Smile, User } from "lucide-react";
import authServices from "@/services/authServices";

function AllChatsBox({
  allUsers,
  setCurrentChatUser,
  setChatType,
  setIsGroup,
}) {
  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return "Yesterday";
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
    <div className="mt-2">
      {!allUsers || allUsers.length == 0 ? (
        <div className="flex w-full items-center justify-center gap-2 py-6 text-sm text-gray-400">
          <span>
            No active users.
            <span
              onClick={() => setChatType("all")}
              className="ml-1 cursor-pointer text-sidebar-primary hover:underline underline-offset-2 transition"
            >
              Start a new chat
            </span>
          </span>
          <Smile size={16} className="text-gray-500" />
        </div>
      ) : (
        allUsers
          ?.filter(
            (user) => user?.email !== authServices?.getCurrentUser().email,
          )
          ?.map((user) => {
            return (
              <Item
                key={user.email}
                onClick={() => {
                  setIsGroup(user?.description ? true : false);
                  setCurrentChatUser(user);
                }}
                className="
                  rounded-lg
                  bg-transparent
                  hover:bg-white/5
                  hover:backdrop-blur-sm
                  transition
                  cursor-pointer
                "
              >
                <ItemContent className="flex flex-row items-start justify-between gap-4 w-full">
                  <div className="flex gap-4 my-auto">
                    <div className=" flex size-10 items-center justify-center rounded-md border">
                      {user?.photo ? (
                        <img
                          src={user.photo}
                          alt="user_img"
                          className="rounded-md h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          {user?.userName[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <ItemTitle>{user?.userName}</ItemTitle>
                      <ItemDescription className="text-muted-foreground text-sm">
                        {user?.email}
                        {user?.description}
                      </ItemDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {user?.timestamp && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatChatTime(user?.timestamp)}
                      </span>
                    )}

                    <Button variant="outline" size="sm">
                      <ListStart /> Chat
                    </Button>
                  </div>
                </ItemContent>
              </Item>
            );
          })
      )}
    </div>
  );
}

export default AllChatsBox;
