import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  AppContainer,
  MainContent,
  Main,
  MobileOverlay,
} from "./Layout.styles";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <AppContainer>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && <MobileOverlay onClick={closeSidebar} />}

      <MainContent>
        <Header toggleSidebar={toggleSidebar} />
        <Main onClick={closeSidebar}>
          <Outlet />
        </Main>
      </MainContent>
    </AppContainer>
  );
}

export default Layout;
