"use client";

import { ChevronRight, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";

export function NavMain({
  setIsGroup,
  handleCreateNew,
  items,
  setCurrentChatUser,
  setActiveTab
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Gather-in</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item?.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {!item?.items || item?.items?.length === 0 ? (
                    <div
                      onClick={() => handleCreateNew(item?.type)}
                      className="flex px-1 items-center text-sm gap-2 "
                    >
                      {" "}
                      <Button
                        className="size-6 rounded-full"
                        variant="outline"
                        size="icon"
                      >
                        <Plus />
                      </Button>
                      <span>create new {item?.type}</span>
                    </div>
                  ) : (
                    <>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem?.email}>
                          <SidebarMenuSubButton asChild>
                            <span
                              onClick={() => {
                                if (item?.type === "group") {
                                  setIsGroup(true);
                                } else {
                                  setIsGroup(false);
                                }
                                setActiveTab("home");
                                setCurrentChatUser(subItem);
                              }}
                            >
                              <div className=" bg-sidebar-primary flex size-5 items-center justify-center rounded-full border">
                                {subItem?.photo ? (
                                  <img
                                    src={subItem?.photo}
                                    alt="user_img"
                                    className="rounded-md h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs">
                                    {subItem?.userName[0]?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span>{subItem?.userName}</span>
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      <div className="px-1 flex items-center text-sm gap-2 ">
                        {" "}
                        <Button
                          className="size-6 rounded-full"
                          variant="outline"
                          size="icon"
                        >
                          <Plus />
                        </Button>
                        <span>add more...</span>
                      </div>
                    </>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
