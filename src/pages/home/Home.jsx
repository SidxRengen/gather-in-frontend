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

function Home() {
  const { allUsers, errorMessage, loading, fetchAllUsers } = useUserContext();
  console.log("allUsers", allUsers);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
  }, [allUsers]);
  return (
    <SidebarProvider
      className={cn("w-lvw dark min-h-screen bg-background text-foreground")}
    >
      <AppSidebar
        setCurrentChatUser={setCurrentChatUser}
        allUsers={allUsers}
        toast={toast}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <div onClick={() => setCurrentChatUser(null)}>
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
                allUsers={allUsers}
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
