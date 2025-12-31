"use client";

import { ChevronRight } from "lucide-react";

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

export function NavMain({ items, setCurrentChatUser }) {
  console.log("items from navmenu", items);
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
                    <SidebarMenuSubButton>No items</SidebarMenuSubButton>
                  ) : (
                    item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.email}>
                        <SidebarMenuSubButton asChild>
                          <span onClick={() => setCurrentChatUser(subItem)}>
                            <div
                              className={` bg-amber-800 flex gap-2 size-5 items-center justify-center rounded-md border`}
                            >
                              {
                                /* <team.logo className="size-3.5 shrink-0" /> */ subItem?.photo &&
                                subItem?.photo !== "" ? (
                                  <>
                                    <img src={subItem?.photo} alt="user_img" />
                                  </>
                                ) : (
                                  <span className="text-xs">
                                    {subItem?.userName[0].toUpperCase()}
                                  </span>
                                )
                              }
                            </div>
                            <span>{subItem.userName}</span>
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
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
