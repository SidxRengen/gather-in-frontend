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

function ChatFooter({ sendMessage, disabled = false, receiverEmail }) {
  const [text, setText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // // Handle copy text
  // const handleCopyText = async () => {
  //   if (!text.trim()) return;

  //   try {
  //     await navigator.clipboard.writeText(text);
  //     setIsCopied(true);
  //     setTimeout(() => setIsCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Failed to copy text: ", err);
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(text, receiverEmail);
      setText("");
    }
  };

  return (
    <div className="absolute bottom-5 right-0 w-full flex justify-center">
      <div className="w-[97%] rounded-xl  bg-white/10 backdrop-blur-md border border-white/30 shadow-lg p-3 flex gap-3 items-center">
        <div className="flex-1">
          <Textarea
            value={text}
            onKeyDown={handleKeyPress}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here."
            className="bg-transparent resize-none focus-visible:ring-0"
          />
        </div>

        <Button
          onClick={() => {
            sendMessage(text, receiverEmail);
            setText("");
          }}
          size="icon"
          className="rounded-full"
          disabled={disabled}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}

export default ChatFooter;
