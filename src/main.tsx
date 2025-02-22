import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import ScrollProvider from "./contexts/ScrollProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScrollProvider>
      <div className={`antialiased bg-black font-display`}>
        <RouterProvider router={router} />
      </div>
    </ScrollProvider>
  </StrictMode>
);
