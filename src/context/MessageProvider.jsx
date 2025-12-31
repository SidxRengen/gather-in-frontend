import React, { createContext } from "react";

const MessageContext = createContext({ children });
function MessageProvider() {
  const stompRef = useRef(null);

  useEffect(() => {
    if (!currentChatUser?.email) return;
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    stompRef.current = client;

    client.connect({}, () => {
      setConnected(true);

      client.subscribe(`/queue/messages/${currentEmail}`, (msg) => {
        const message = JSON.parse(msg.body);
        console.log(
          "message from socket",
          message,
          message?.senderEmail,
          currentEmail
        );
        if (message?.senderEmail !== currentEmail) {
          toast.info(
            "message from " + message?.senderUserName + ": " + message.content
          );
        }
        setMessages((prev) => [...prev, message]);
      });
    });

    return () => {
      setConnected(false);
      client.disconnect();
      stompRef.current = null;
    };
  }, [currentChatUser.email]);

  const sendMessage = (text) => {
    if (!connected || !stompRef.current) {
      console.warn("STOMP not connected");
      return;
    }

    stompRef.current.send(
      "/app/chat/send",
      {},
      JSON.stringify({
        content: text,
        receiverEmail: currentChatUser.email,
        senderEmail: currentEmail,
      })
    );

    console.log(
      JSON.stringify({
        content: text,
        receiverEmail: currentChatUser.email,
        senderEmail: currentEmail,
      })
    );
  };
  return <MessageContext.Provider>{children}</MessageContext.Provider>;
}

export default MessageProvider;
