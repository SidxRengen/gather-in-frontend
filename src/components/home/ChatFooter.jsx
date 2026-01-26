import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Image as ImageIcon,
  Mic,
  Smile,
  Send,
  Loader2,
  MapPin,
  Video,
  MoreVertical,
  X,
  Check,
  Copy,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "../ui/textarea";
import { Tooltip } from "../other/Tooltip";
import { toast } from "sonner";
import { EMOJIS } from "@/constants/data";
const IconButton = React.forwardRef(({ icon, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`
          cursor-pointer
          p-2
          rounded-lg
          text-gray-400
          hover:text-gray-200
          hover:bg-white/5
          transition
          ${icon && ""}
        `}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = "IconButton";

function ChatFooter({
  groupId,
  sendMessage,
  loading,
  isGroup,
  disabled = false,
  receiverEmail,
  senderEmail,
}) {
  console.log("loading here...", loading);
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const textareaRef = useRef(null);
  const handleKeyPress = (e) => {
    if (loading) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim().length == 0 && !file) {
        return;
      }
      if (isGroup) {
        sendMessage(text, groupId, file);
      } else {
        sendMessage(text, receiverEmail, file);
      }
      setText("");
      setFile(null);
      setPreviewUrl(null);
    }
  };
  const handleFileChange = (e) => {
    const curFile = e.target.files[0];
    if (!curFile) return;

    setFile(curFile);
    setPreviewUrl(URL.createObjectURL(curFile));
    e.target.value = "";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText = text.substring(0, start) + emoji + text.substring(end);

    setText(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    });
  };
  const handleSend = () => {
    if (loading) return;
    if (!text.trim() && !file && !location) return;
    if (text.length > 1000) {
      toast.error("text cannot exceed 1000 characters");
      return;
    }
    let finalText = text;

    if (location) {
      finalText = JSON.stringify({
        type: "location",
        lat: location.lat,
        lng: location.lng,
      });
    }

    if (isGroup) {
      sendMessage(finalText, groupId, file);
    } else {
      sendMessage(finalText, receiverEmail, file);
    }

    setText("");
    setFile(null);
    setPreviewUrl(null);
    setLocation(null);
  };
  return (
    <div className="absolute  bottom-4 left-0 w-full flex justify-center">
      {location && (
        <div className="absolute bottom-full mb-2 left-10">
          <div
            className="
        relative
        rounded-xl
        bg-black/60
        backdrop-blur-md
        border border-white/10
        shadow-lg
        px-4 py-2
        flex items-center gap-3
      "
          >
            <MapPin size={16} className="text-blue-400" />

            <div className="text-xs text-gray-300">
              <div className="font-medium">Current Location</div>
              <div className="opacity-70">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            </div>

            <button
              onClick={() => setLocation(null)}
              className="
          ml-2
          h-6 w-6
          rounded-full
          bg-black/70
          border border-white/20
          flex items-center justify-center
          text-gray-300
          hover:text-white
          hover:bg-red-500/80
          transition
        "
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
      {previewUrl && (
        <div className="absolute bottom-full mb-2 left-10 ">
          <div
            className="
              relative
              rounded-xl
              bg-black/60
              backdrop-blur-md
              border border-white/10
              shadow-lg
              p-2
            "
          >
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-20 max-w-[120px] rounded-lg object-cover"
            />

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              className="
                absolute -top-2 -right-2
                h-6 w-6
                rounded-full
                bg-black/80
                border border-white/20
                flex items-center justify-center
                text-gray-300
                hover:text-white
                hover:bg-red-500/80
                transition
              "
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      <div
        className="
         w-[96%]
        rounded-xl
        bg-black/40
        backdrop-blur-md
        border border-white/10
        px-3 py-2
        flex items-end gap-2
        shadow-[0_0_8px_rgba(256,250,256,0.25)]
        transition-all duration-300 ease-out
        hover:shadow-[0_0_14px_rgba(59,130,246,0.30)]
        focus-within:shadow-[0_0_18px_rgba(59,230,46,0.40)]
      "
      >
        <div className="flex items-center gap-1 h-full">
          <Tooltip label="Emoji">
            <span
              className={`inline-flex relative ${location ? "opacity-40 pointer-events-none" : ""}`}
            >
              <IconButton
                icon={<Smile size={18} />}
                onClick={() => {
                  if (loading) return;
                  if (!location) setShowEmojiPicker((p) => !p);
                }}
              />

              {showEmojiPicker && (
                <div
                  ref={emojiRef}
                  className="
                    absolute bottom-full mb-2 left-0
                    z-50
                    w-56
                    max-h-60
                    overflow-y-auto
                    rounded-xl
                    bg-black/70
                    backdrop-blur-md
                    border border-white/10
                    shadow-lg
                    p-3
                    scrollbar-thin
                    scrollbar-thumb-white/20
                    scrollbar-track-transparent
                  "
                >
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          addEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="
                          text-lg
                          rounded-lg
                          hover:bg-white/10
                          transition
                        "
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </span>
          </Tooltip>
          <Tooltip label="Send image">
            <span
              className={`${location ? "opacity-40 pointer-events-none" : ""} inline-flex`}
            >
              <IconButton
                icon={<ImageIcon size={18} />}
                onClick={() => {
                  if (loading) return;
                  if (!location) fileRef.current.click();
                }}
              />
            </span>
          </Tooltip>
          <Tooltip label="Share location">
            <span className="inline-flex">
              <IconButton
                icon={<MapPin size={18} />}
                onClick={() => {
                  if (loading) return;
                  setText("");
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      });
                    },
                    () => {
                      toast.error("Unable to access location");
                    },
                  );
                }}
              />
            </span>
          </Tooltip>
        </div>

        <Textarea
          ref={textareaRef}
          value={text}
          disabled={location || loading}
          onKeyDown={handleKeyPress}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here."
          rows={1}
          className="
            flex-1
            resize-none
            bg-transparent
            border-none
            text-sm
            text-gray-200
            placeholder:text-gray-500
            focus-visible:ring-0
          "
        />
        <Tooltip label="Send Message">
          <Button
            onClick={handleSend}
            size="icon"
            className="
          my-auto
          rounded-full
          bg-chart-2
          cursor-pointer
          hover:bg-chart-2/70
          "
            disabled={disabled || loading}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </Tooltip>
        <input
          onChange={handleFileChange}
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          disabled={!!location || loading}
        />
      </div>
    </div>
  );
}

export default ChatFooter;
