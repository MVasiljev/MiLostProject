import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import StringsPage from "../pages/Strings/Strings";
import WelcomePage from "../pages/Welcome/Welcome";
import VectorPage from "../pages/Vector/Vector";
import TuplePage from "../pages/Tuple/Tuple";

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
        element: <VectorPage />,
      },
      {
        path: "tuples",
        element: <TuplePage />,
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
  TUPLES: "/tuples",
};

export default router;
