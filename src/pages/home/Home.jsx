import React, { useCallback, useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/home/AppSidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AllChatsBox from "@/components/home/AllChatsBox";
import ChatBox from "@/components/home/ChatBox";
import { useUserContext } from "@/context/UsersProvider";
import Loader from "@/components/home/Loader";
import { PlusCircle } from "lucide-react";

function Home() {
  const { allActiveUsers, allUsers, errorMessage, loading, fetchAllUsers } =
    useUserContext();
  const [chatType, setChatType] = useState("active");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    console.log("allUsers from home", allUsers);
  }, [allUsers]);
  return (
    <SidebarProvider
      className={cn("w-lvw dark min-h-screen bg-background text-foreground")}
    >
      <AppSidebar
        setCurrentChatUser={setCurrentChatUser}
        allUsers={allUsers}
        toast={toast}
        allActiveUsers={allActiveUsers}
      />
      <SidebarInset>
        <header className="flex  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <div
                    onClick={() => {
                      setChatType("active");
                      setCurrentChatUser(null);
                    }}
                  >
                    <BreadcrumbLink>Start a Chat</BreadcrumbLink>
                  </div>
                </BreadcrumbItem>
                {currentChatUser && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        {currentChatUser?.userName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2 items-center ml-auto mr-10">
            <div
              onClick={() => {
                setChatType("all");
                setCurrentChatUser(null);
              }}
              className="bg-sidebar-primary  text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
            >
              <PlusCircle className="size-5" />
            </div>
            {/* <span className="text-sm text-gray-400">New Chat</span> */}
          </div>
        </header>
        <div className="px-4 ">
          {loading && (
            <>
              <Loader />
            </>
          )}
          {!loading && currentChatUser ? (
            <>
              <ChatBox currentChatUser={currentChatUser} />
            </>
          ) : (
            <>
              <AllChatsBox
                setChatType={setChatType}
                allUsers={chatType === "all" ? allUsers : allActiveUsers}
                setCurrentChatUser={setCurrentChatUser}
              />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Home;
