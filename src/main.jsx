import "./polyfills/global";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UsersProvider from "./context/UsersProvider";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";
import MessageProvider from "./context/MessageProvider";
import GroupMessageProvider from "./context/GroupMessageProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UsersProvider>
        <MessageProvider>
          <GroupMessageProvider>
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </GroupMessageProvider>
        </MessageProvider>
      </UsersProvider>
    </AuthProvider>
  </StrictMode>
);
