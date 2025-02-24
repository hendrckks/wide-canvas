import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../app/MainLayout";
import Home from "../app/pages/Home";
import Contact from "../app/pages/Contact";
import CreateProject from "../app/pages/CreateProject";
import FAQ from "../sections/FAQ";
import AlbumView from "../app/pages/AlbumView";
import Works from "../app/pages/Works";
import { AnimatePresence } from "framer-motion";

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
    ],
  },
]);
