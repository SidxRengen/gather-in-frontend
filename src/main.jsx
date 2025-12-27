import "./polyfills/global";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UsersProvider from "./context/UsersProvider";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UsersProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </UsersProvider>
    </AuthProvider>
  </StrictMode>
);
