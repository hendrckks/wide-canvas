import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../app/MainLayout";
import Home from "../app/pages/Home";
import Contact from "../app/pages/Contact";
import CreateProject from "../app/pages/CreateProject";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/contact" ,
        element: <Contact />,
      },
      {
        path: "/add-project" ,
        element: <CreateProject />,
      },
    ],
  },
]);
