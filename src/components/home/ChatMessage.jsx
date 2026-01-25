import React from "react";
import { Item, ItemDescription, ItemTitle } from "../ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Copy, MapPin } from "lucide-react";

function ChatMessage({ right, message, userName, photo, timestamp, image }) {
  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return "yesterday";
    }
    if (isToday) {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  let locationData = null;

  try {
    const parsed = JSON.parse(message);
    if (parsed?.type === "location") {
      locationData = parsed;
    }
  } catch (e) {
    locationData = null;
  }

  return (
    <div className={`flex w-full ${right && "justify-end"}`}>
      <div
        className={`max-w-[90%] flex gap-2 items-center ${
          right && "flex-row-reverse"
        }`}
      >
        <div
          className={` flex gap-2 size-6 items-center justify-center rounded-md border`}
        >
          {
            /* <team.logo className="size-3.5 shrink-0" /> */ photo &&
            photo !== "" ? (
              <>
                <img
                  src={photo}
                  alt="user_img"
                  className="rounded-md h-full w-full object-cover"
                />
              </>
            ) : (
              <span className="text-sm">
                {userName && userName[0]?.toUpperCase()}
              </span>
            )
          }
        </div>

        <Item
          className={`group relative flex flex-col ${
            right ? "items-end" : "items-start"
          } gap-1
          bg-black/40
          backdrop-blur-md
          border border-white/10
          shadow-lg`}
          variant="outline"
        >
          <button
            onClick={() => navigator.clipboard.writeText(message)}
            className={`
              absolute bottom-1
              ${right ? "left-1" : "right-1"}
              opacity-0 group-hover:opacity-100
              transition
              p-1
              cursor-pointer
              rounded-md
              bg-black/60
              text-gray-300
              hover:text-white
              hover:bg-white/10
            `}
            aria-label="Copy message"
          >
            <Copy size={14} opacity={0.3}/>
          </button>
          {image && (
            <img
              src={image}
              alt="chat_image"
              className="
                max-w-[220px]
                max-h-[260px]
                rounded-lg
                object-cover
                mb-1
              "
            />
          )}

          {locationData ? (
            <a
              href={`https://www.google.com/maps?q=${locationData.lat},${locationData.lng}`}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-2
                rounded-lg
                bg-blue-500/10
                border border-blue-400/20
                px-3 py-2
                text-blue-400
                hover:bg-blue-500/20
                transition
              "
            >
              <MapPin size={16} />
              <span className="text-sm font-medium">
                Shared Location
              </span>
            </a>
          ) : (
            <span className="font-medium">{message}</span>
          )}
          <span className="text-xs  text-gray-300">
            {formatChatTime(timestamp)}
          </span>
        </Item>
      </div>
    </div>
  );
}

export default ChatMessage;
