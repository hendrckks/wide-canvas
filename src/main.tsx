import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import ScrollProvider from "./contexts/ScrollProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ScrollProvider>
        <div className={`antialiased bg-black font-display`}>
          <RouterProvider router={router} />
        </div>
      </ScrollProvider>
    </ThemeProvider>
  </StrictMode>
);
