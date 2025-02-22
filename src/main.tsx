import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className={`antialiased bg-black font-display`}>
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
