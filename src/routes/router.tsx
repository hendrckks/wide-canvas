import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../app/MainLayout";
import Home from "../app/pages/Home";
import Contact from "../app/pages/Contact";
import CreateProject from "../app/pages/CreateProject";
import FAQ from "../app/pages/FAQ";
import AlbumView from "../app/pages/AlbumView";
import Works from "../app/pages/Works";
import { AnimatePresence } from "framer-motion";
import AboutSection from "../app/pages/AboutSection";
import VideoManager from "../app/pages/VideoManagers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AnimatePresence mode="sync">
        <MainLayout />
      </AnimatePresence>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/add-project",
        element: <CreateProject />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/project/:slug",
        element: <AlbumView />,
      },
      {
        path: "/works",
        element: <Works />,
      },
      {
        path: "/about",
        element: <AboutSection />,
      },
      {
        path: "/add-video",
        element: <VideoManager />,
      },
    ],
  },
]);
