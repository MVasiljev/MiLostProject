import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import StringsPage from "../pages/Strings/Strings";
import WelcomePage from "../pages/Welcome/Welcome";
import VectorPage from "../pages/Vector/Vector";
import TuplePage from "../pages/Tuple/Tuple";
import StructPage from "../pages/Struct/Struct";
import HashMapPage from "../pages/HashMap/HashMap";
import StatusPage from "../pages/Status/Status";
import GettingStartedPage from "../pages/GettingStarted/GettingStarted";
import PrimitivesPage from "../pages/Primitives/Primitives";
import HashSetPage from "../pages/HashSet/HashSet";
// import BrandingPage from "../pages/Branding/Branding";
// import CommonPage from "../pages/Common/Common";

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
        path: "get-started",
        element: <GettingStartedPage />,
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
      {
        path: "structs",
        element: <StructPage />,
      },
      {
        path: "hashmaps",
        element: <HashMapPage />,
      },
      {
        path: "primitives",
        element: <PrimitivesPage />,
      },
      {
        path: "hashsets",
        element: <HashSetPage />,
      },
      // {
      //   path: "branding",
      //   element: <BrandingPage />,
      // },
      // {
      //   path: "common",
      //   element: <CommonPage />,
      // },
      {
        path: "status",
        element: <StatusPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

export const ROUTES = {
  HOME: "/",
  GET_STARTED: "/getting-started",
  STRINGS: "/strings",
  VECTORS: "/vectors",
  TUPLES: "/tuples",
  STRUCTS: "/structs",
  HASHMAPS: "/hashmaps",
  PRIMITIVES: "/primitives",
  HASHSETS: "/hashsets",
  BRANDING: "/branding",
  COMMON: "/common",
  STATUS: "/status",
};

export default router;
