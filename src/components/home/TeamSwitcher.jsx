"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, PlusCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import authServices from "@/services/authServices";

export function TeamSwitcher({ allUsers, setCurrentChatUser }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <PlusCircle className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">New Chat</span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(
              "dark bg-background text-foreground w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            )}
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Users
            </DropdownMenuLabel>
            {allUsers
              ?.filter(
                (user) => user.email !== authServices?.getCurrentUser()?.email
              )
              ?.map((user, index) => (
                <DropdownMenuItem
                  key={user.email}
                  onClick={() => {
                    setCurrentChatUser(user);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="bg-sidebar-primary flex size-6 items-center justify-center rounded-md border">
                    {
                      /* <team.logo className="size-3.5 shrink-0" /> */ user?.photo &&
                      user?.photo !== "" ? (
                        <>
                          <img src={user?.photo} alt="user_img" />
                        </>
                      ) : (
                        <>{user?.userName[0].toUpperCase()}</>
                      )
                    }
                  </div>
                  {user.userName}
                  <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            {/* <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
