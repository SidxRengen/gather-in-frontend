import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Tooltip } from "../other/Tooltip";

function NotificationPanel({ notifications, setNotifications }) {
  return (
    <DropdownMenu>
      <Tooltip label="Notifications">
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="cursor-pointer size-8 bg-muted text-muted-foreground hover:bg-muted/80"
          >
            <Bell className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[500px] p-2 backdrop-blur-xs bg-black/20 border border-white/10 shadow-lg rounded-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="text-sm font-medium text-gray-100">
            Notifications
          </span>

          {notifications?.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="text-xs text-gray-400 cursor-pointer hover:text-red-400 transition"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty State */}
        {(!notifications || notifications.length === 0) && (
          <div className="text-sm text-gray-400 text-center py-6">
            No notifications yet
          </div>
        )}

        {/* Notifications List */}
        {notifications?.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition"
          >
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-gray-300 shrink-0">
              {item.senderUserName?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="flex flex-col text-sm flex-1 min-w-0">
              <span className="font-medium text-gray-100 truncate">
                {item.senderUserName}
                {item.isGroup && item.groupName && (
                  <span className="text-xs text-gray-400 font-normal">
                    {" "}
                    in {item.groupName}
                  </span>
                )}
              </span>

              <div className="relative group/message max-w-full">
                <span className="text-gray-400 line-clamp-3 cursor-default">
                  {item.message}
                </span>
              </div>
            </div>

            {/* Remove single notification */}
            <button
              onClick={() =>
                setNotifications((prev) => prev.filter((n) => n.id !== item.id))
              }
              className="
                opacity-0 group-hover:opacity-100
                transition
                border border-red-400/40
                text-red-400
                rounded-full
                p-1
                cursor-pointer
                hover:bg-red-400/10
              "
              aria-label="Remove notification"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationPanel;
