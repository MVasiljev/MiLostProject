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
import CommonPage from "../pages/Common/Common";
import BrandingPage from "../pages/Branding/Branding";
// Pages to implement
import OptionPage from "../pages/Option/Option";
// import ResultPage from "../pages/Result/Result";
// import IterPage from "../pages/Iter/Iter";
// import FunctionalPage from "../pages/Functional/Functional";
// import SyncPrimitivesPage from "../pages/SyncPrimitives/SyncPrimitives";
// import SmartPointersPage from "../pages/SmartPointers/SmartPointers";
// import ComputedPage from "../pages/Computed/Computed";
// import OwnershipPage from "../pages/Ownership/Ownership";
// import ReferencePage from "../pages/Reference/Reference";
// import MatchingPage from "../pages/Matching/Matching";
// import ContractPage from "../pages/Contract/Contract";
// import AsyncPage from "../pages/Async/Async";
// import ResourcePage from "../pages/Resource/Resource";
// import AsyncUtilsPage from "../pages/AsyncUtils/AsyncUtils";
// import ErrorsPage from "../pages/Errors/Errors";

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
      {
        path: "branding",
        element: <BrandingPage />,
      },
      {
        path: "common",
        element: <CommonPage />,
      },
      {
        path: "status",
        element: <StatusPage />,
      },
      // New routes
      {
        path: "option",
        element: <OptionPage />,
      },
      // {
      //   path: "result",
      //   element: <ResultPage />,
      // },
      // {
      //   path: "iter",
      //   element: <IterPage />,
      // },
      // {
      //   path: "functional",
      //   element: <FunctionalPage />,
      // },
      // {
      //   path: "sync-primitives",
      //   element: <SyncPrimitivesPage />,
      // },
      // {
      //   path: "smart-pointers",
      //   element: <SmartPointersPage />,
      // },
      // {
      //   path: "computed",
      //   element: <ComputedPage />,
      // },
      // {
      //   path: "ownership",
      //   element: <OwnershipPage />,
      // },
      // {
      //   path: "reference",
      //   element: <ReferencePage />,
      // },
      // {
      //   path: "matching",
      //   element: <MatchingPage />,
      // },
      // {
      //   path: "contract",
      //   element: <ContractPage />,
      // },
      // {
      //   path: "async",
      //   element: <AsyncPage />,
      // },
      // {
      //   path: "resource",
      //   element: <ResourcePage />,
      // },
      // {
      //   path: "async-utils",
      //   element: <AsyncUtilsPage />,
      // },
      // {
      //   path: "errors",
      //   element: <ErrorsPage />,
      // },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

export const ROUTES = {
  HOME: "/",
  GET_STARTED: "/get-started",
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
  // New routes
  OPTION: "/option",
  RESULT: "/result",
  ITER: "/iter",
  FUNCTIONAL: "/functional",
  SYNC_PRIMITIVES: "/sync-primitives",
  SMART_POINTERS: "/smart-pointers",
  COMPUTED: "/computed",
  OWNERSHIP: "/ownership",
  REFERENCE: "/reference",
  MATCHING: "/matching",
  CONTRACT: "/contract",
  ASYNC: "/async",
  RESOURCE: "/resource",
  ASYNC_UTILS: "/async-utils",
  ERRORS: "/errors",
};

export default router;
