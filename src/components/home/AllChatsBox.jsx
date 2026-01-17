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

function AllChatsBox({ allUsers, setCurrentChatUser, setChatType }) {
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
    <div>
      {!allUsers || allUsers.length == 0 ? (
        <div className=" text-gray-300 flex w-full justify-center gap-2 py-4">
          <span className="text-xl">
            No Active User, Start{" "}
            <span
              onClick={() => setChatType("all")}
              className="cursor-pointer text-sidebar-primary underline underline-offset-2"
            >
              New Chat
            </span>
          </span>
          <Smile size={24} />
        </div>
      ) : (
        allUsers
          ?.filter(
            (user) => user?.email !== authServices?.getCurrentUser().email
          )
          ?.map((user) => {
            return (
              <Item
                key={user.email}
                className="hover:bg-accent"
                onClick={() => setCurrentChatUser(user)}
              >
                <ItemContent className="flex flex-row items-start justify-between gap-4 w-full">
                  {/* Left section */}
                  <div className="flex gap-4 my-auto">
                    <div className="bg-sidebar-primary flex size-10 items-center justify-center rounded-md border">
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
                      </ItemDescription>
                    </div>
                  </div>

                  {/* Right section */}
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
