import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Button } from "../ui/button";
import { Link, ListStart, User } from "lucide-react";
import authServices from "@/services/authServices";

function AllChatsBox({ allUsers, setCurrentChatUser }) {
  return (
    <div>
      {allUsers
        ?.filter((user) => user?.email !== authServices?.getCurrentUser().email)
        ?.map((user) => {
          return (
            <Item
              key={user.email}
              className="hover:bg-accent"
              onClick={() => {
                setCurrentChatUser(user);
              }}
            >
              <ItemContent className={" flex flex-row gap-4"}>
                <div className="bg-sidebar-primary flex  size-10 items-center justify-center rounded-md border">
                  {
                    /* <team.logo className="size-3.5 shrink-0" /> */ user?.photo &&
                    user?.photo !== "" ? (
                      <>
                        <img src={user?.photo} alt="user_img" />
                      </>
                    ) : (
                      <span className="text-2xl">
                        {user?.userName[0].toUpperCase()}
                      </span>
                    )
                  }
                </div>
                <div>
                  <ItemTitle>{user?.userName}</ItemTitle>
                  <ItemDescription>{user?.email}</ItemDescription>
                </div>
              </ItemContent>

              <ItemActions>
                <Button variant="outline" size="sm">
                  <ListStart /> Chat
                </Button>
              </ItemActions>
            </Item>
          );
        })}
    </div>
  );
}

export default AllChatsBox;
