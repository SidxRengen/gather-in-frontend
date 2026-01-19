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
import { HomeIcon, PlusCircle, Settings } from "lucide-react";
import ProfilePage from "@/components/home/ProfilePage";
import AddGroup from "@/components/home/AddGroup";
import { Button } from "@/components/ui/button";
import GroupSettings from "@/components/home/GroupSettings";

function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const {
    allActiveUsers,
    allUsers,
    errorMessage,
    loading,
    profile,
    allActiveGroups,
    setAllActiveGroups,
  } = useUserContext();
  const [chatType, setChatType] = useState("active");
  const [isGroup, setIsGroup] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [groupInfo, setGroupInfo] = useState({});
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    console.log("allUsers from home", allUsers);
  }, [allUsers]);
  console.log("activeTab", activeTab);
  const wallpaperStyle = profile?.wallpaper
    ? {
        backgroundImage: `url(${profile.wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};
  return (
    <SidebarProvider
      className={cn("w-lvw dark min-h-screen bg-background text-foreground")}
    >
      <AppSidebar
        setIsGroup={setIsGroup}
        profilePhoto={profile.photo}
        setActiveTab={setActiveTab}
        setCurrentChatUser={setCurrentChatUser}
        allUsers={allUsers}
        toast={toast}
        allActiveGroups={allActiveGroups}
        allActiveUsers={allActiveUsers}
      />
      <SidebarInset
        style={wallpaperStyle}
        className="relative min-h-screen overflow-hidden"
      >
        {wallpaperStyle && (
          <div className="absolute inset-0 bg-black/40  pointer-events-none" />
        )}
        <div className="relative z-10">
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
                    <div
                      onClick={() => {
                        setActiveTab("home");
                        setChatType("active");
                        setCurrentChatUser(null);
                      }}
                    >
                      <BreadcrumbLink>
                        <HomeIcon size={16} />
                      </BreadcrumbLink>
                    </div>
                  </BreadcrumbItem>
                  {activeTab === "profile" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink>profile</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {activeTab === "addGroup" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink>create group</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {currentChatUser && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem onClick={() => setActiveTab("home")}>
                        <BreadcrumbLink>
                          {currentChatUser?.userName}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {activeTab === "groupSettings" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink>Settings</BreadcrumbLink>
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
                className={` bg-sidebar-primary cursor-pointer
               text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg`}
              >
                <PlusCircle className="size-5" />
              </div>
              {isGroup && (
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setActiveTab("groupSettings");
                  }}
                  aria-label="Submit"
                >
                  <Settings />
                </Button>
              )}
            </div>
          </header>
          <div className="px-4 ">
            {loading && (
              <>
                <Loader />
              </>
            )}
            {activeTab === "home" &&
              !loading &&
              (currentChatUser ? (
                <>
                  <ChatBox
                    setGroupInfo={setGroupInfo}
                    isGroup={isGroup}
                    currentChatUser={currentChatUser}
                  />
                </>
              ) : (
                <>
                  <AllChatsBox
                    setChatType={setChatType}
                    allUsers={chatType === "all" ? allUsers : allActiveUsers}
                    setCurrentChatUser={setCurrentChatUser}
                  />
                </>
              ))}

            {activeTab === "profile" && !loading && <ProfilePage />}
            {activeTab === "addGroup" && !loading && (
              <AddGroup
                setActiveTab={setActiveTab}
                setAllActiveGroups={setAllActiveGroups}
              />
            )}
            {activeTab === "groupSettings" && !loading && (
              <GroupSettings
                allActiveUsers={allActiveUsers}
                groupInfo={groupInfo}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Home;
