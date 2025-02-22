import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../app/MainLayout";
import Home from "../app/pages/Home";
import Contact from "../app/pages/Contact";

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
    ],
  },
]);
