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
import { Bell, HomeIcon, PlusCircle, Settings } from "lucide-react";
import ProfilePage from "@/components/home/ProfilePage";
import AddGroup from "@/components/home/AddGroup";
import { Button } from "@/components/ui/button";
import GroupSettings from "@/components/home/GroupSettings";
import NotificationPanel from "@/components/home/NotificationPanel";
import { Tooltip } from "@/components/other/Tooltip";
import { useNavigate } from "react-router-dom";

function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const {
    allActiveUsers,
    allUsers,
    errorMessage,
    loading,
    profile,
    status,
    allActiveGroups,
    setAllActiveGroups,
  } = useUserContext();
  const isInitialLoading = loading && !allUsers?.length;
  const navigate = useNavigate();
  const [chatType, setChatType] = useState("active");
  const [isGroup, setIsGroup] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [groupInfo, setGroupInfo] = useState({});
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("notifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    if (!errorMessage) return;

    // if (status === 403 || status === 401) {
    //   navigate("/", { replace: true });
    // }

    toast.error(errorMessage);
  }, [errorMessage, status, navigate]);
  console.log("activeTab", activeTab);
  const wallpaperStyle = profile?.wallpaper
    ? {
        backgroundImage: `url(${profile.wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};
  const blurMap = {
    none: "",
    sm: "backdrop-blur-sm",
    xs: "backdrop-blur-xs",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };
  const opacityValue = Math.min(
    Math.max((100 - Number(profile.opacity)) / 100, 0),
    1,
  );
  useEffect(() => {
    if (activeTab === "profile") {
      setCurrentChatUser(null);
    }
  }, [activeTab]);

  return (
    <SidebarProvider className={cn("w-lvw  h-full")}>
      <AppSidebar
        setIsGroup={setIsGroup}
        profilePhoto={profile.photo}
        setActiveTab={setActiveTab}
        setCurrentChatUser={setCurrentChatUser}
        allUsers={allUsers}
        setChatType={setChatType}
        toast={toast}
        allActiveGroups={allActiveGroups}
        allActiveUsers={allActiveUsers}
      />
      <SidebarInset
        style={wallpaperStyle}
        className="relative min-h-screen overflow-hidden"
      >
        {wallpaperStyle && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Blur layer */}
            {profile.blur !== "none" && (
              <div
                className={cn("absolute inset-0", blurMap[profile.blur])}
                style={{ backgroundColor: "rgba(0,0,0,0.01)" }}
              />
            )}

            {/* Dark overlay layer */}
            {opacityValue > 0 && (
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: opacityValue }}
              />
            )}
          </div>
        )}
        <div className="relative z-10">
          <header
            className="flex     bg-black/40
          backdrop-blur-md
          border-b border-white/10
          shadow-lg h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="block cursor-pointer">
                    <Tooltip label="Home">
                      <div
                        onClick={() => {
                          setActiveTab("home");
                          setChatType("active");
                          setIsGroup(false);
                          setCurrentChatUser(null);
                        }}
                      >
                        <BreadcrumbLink>
                          <HomeIcon size={16} />
                        </BreadcrumbLink>
                      </div>
                    </Tooltip>
                  </BreadcrumbItem>
                  {activeTab === "profile" && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem className="block cursor-pointer">
                        <BreadcrumbLink>profile</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {activeTab === "addGroup" && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink>create group</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {currentChatUser && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem onClick={() => setActiveTab("home")}>
                        <BreadcrumbLink>
                          {currentChatUser?.userName}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {activeTab === "groupSettings" && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink>Settings</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto mr-4 md:mr-10 flex items-center gap-2">
              <div>
                <NotificationPanel
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>

              <Tooltip label="New Chat">
                <div
                  onClick={() => {
                    setChatType("all");
                    setCurrentChatUser(null);
                  }}
                  className=" 
                flex size-8 cursor-pointer items-center justify-center rounded-lg
                bg-primary/10 text-primary
                hover:bg-primary/20
                transition
                "
                >
                  <PlusCircle className="size-5" />
                </div>
              </Tooltip>
              {isGroup && (
                <Button
                  size="icon"
                  onClick={() => setActiveTab("groupSettings")}
                  className="
                  cursor-pointer
        size-8
        bg-slate-100 text-slate-700
        hover:bg-slate-200
        dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
      "
                  aria-label="Group Settings"
                >
                  <Settings className="size-4" />
                </Button>
              )}
            </div>
          </header>
          <div className="px-4 ">
            {isInitialLoading ? (
              <Loader />
            ) : (
              <>
                {activeTab === "home" &&
                  (currentChatUser ? (
                    <ChatBox
                      setGroupInfo={setGroupInfo}
                      isGroup={isGroup}
                      currentChatUser={currentChatUser}
                      setNotifications={setNotifications}
                    />
                  ) : (
                    <AllChatsBox
                      setChatType={setChatType}
                      setIsGroup={setIsGroup}
                      allUsers={
                        chatType === "all"
                          ? allUsers
                          : [...allActiveUsers, ...allActiveGroups]
                      }
                      setCurrentChatUser={setCurrentChatUser}
                    />
                  ))}

                {activeTab === "profile" && <ProfilePage />}
                {activeTab === "addGroup" && (
                  <AddGroup
                    setActiveTab={setActiveTab}
                    setAllActiveGroups={setAllActiveGroups}
                  />
                )}
                {activeTab === "groupSettings" && (
                  <GroupSettings
                    allActiveUsers={allActiveUsers}
                    groupInfo={groupInfo}
                    setActiveTab={setActiveTab}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Home;
