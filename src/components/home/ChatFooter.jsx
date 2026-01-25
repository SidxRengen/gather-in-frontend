import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Image as ImageIcon,
  Mic,
  Smile,
  Send,
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
const IconButton = React.forwardRef(({ icon, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="
          cursor-pointer
          p-2
          rounded-lg
          text-gray-400
          hover:text-gray-200
          hover:bg-white/5
          transition
        "
    >
      {icon}
    </button>
  );
});

IconButton.displayName = "IconButton";

function ChatFooter({
  groupId,
  sendMessage,
  isGroup,
  disabled = false,
  receiverEmail,
  senderEmail,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);
  const [text, setText] = useState("");
  const handleKeyPress = (e) => {
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
  return (
    <div className="absolute bottom-4 left-0 w-full flex justify-center">
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
          shadow-lg
          px-3 py-2
          flex items-end gap-2
        "
      >
        <div className="flex items-center gap-1 h-full">
          <Tooltip label="Emoji">
            <span className="inline-flex">
              <IconButton icon={<Smile size={18} />} />
            </span>
          </Tooltip>
          <Tooltip label="Send image">
            <span className="inline-flex">
              <IconButton
                icon={<ImageIcon size={18} />}
                onClick={() => fileRef.current.click()}
              />
            </span>
          </Tooltip>
          <Tooltip label="Share location">
            <span className="inline-flex">
              <IconButton icon={<MapPin size={18} />} />
            </span>
          </Tooltip>
        </div>

        <Textarea
          value={text}
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
            onClick={() => {
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
            }}
            size="icon"
            className="
          my-auto
          rounded-full
          bg-chart-2
          cursor-pointer
          hover:bg-chart-2/70
          "
            disabled={disabled}
          >
            <Send size={20} />
          </Button>
        </Tooltip>
        <input
          onChange={handleFileChange}
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
        />
      </div>
    </div>
  );
}

export default ChatFooter;
