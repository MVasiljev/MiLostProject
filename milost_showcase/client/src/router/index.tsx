import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import StringsPage from "../pages/Strings/Strings";
import WelcomePage from "../pages/Welcome/Welcome";
import Vector from "../pages/Vector/Vector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "strings",
        element: <StringsPage />,
      },
      {
        path: "vectors",
        element: <Vector />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

export const ROUTES = {
  HOME: "/",
  STRINGS: "/strings",
  VECTORS: "/vectors",
};

export default router;
