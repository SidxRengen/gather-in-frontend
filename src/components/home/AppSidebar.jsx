import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  GroupIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Star,
  User2,
  User2Icon,
  UsersIcon,
  UserStar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavUser } from "./NavUser";
import { groupServices } from "@/services/groupServices";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
export function AppSidebar({ ...props }) {
  const navMain = [
    {
      title: "Active Chats",
      type: "user",
      url: "#",
      icon: User2Icon,
      isActive: true,
      items: props.allActiveUsers,
    },
    {
      title: "Groups",
      type: "group",
      url: "#",
      icon: UsersIcon,
      items: props.allActiveGroups,
    },
    {
      title: "Favourites",
      type: "favourite",
      url: "#",
      icon: UserStar,
      items: [],
    },
  ];
  const handleCreateNew = (type) => {
    if (type === "group") {
      props.setActiveTab("addGroup");
    }
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          setCurrentChatUser={props?.setCurrentChatUser}
          allUsers={props?.allUsers}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          setActiveTab={props.setActiveTab}
          setIsGroup={props?.setIsGroup}
          handleCreateNew={handleCreateNew}
          setCurrentChatUser={props?.setCurrentChatUser}
          items={navMain}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          profilePhoto={props.profilePhoto}
          setActiveTab={props.setActiveTab}
          user={data.user}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
