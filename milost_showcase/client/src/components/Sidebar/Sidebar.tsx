import React from "react";
import { ROUTES } from "../../router";
import {
  SidebarContainer,
  Logo,
  LogoTitle,
  LogoSubtitle,
  Nav,
  NavList,
  StyledNavLink,
  Footer,
  CloseButton,
  SectionDivider,
  SectionTitle,
} from "./Sidebar.styles";

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navSections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { id: "home", label: "Home", path: ROUTES.HOME },
        { id: "get-started", label: "Get Started", path: ROUTES.GET_STARTED },
      ],
    },
    {
      title: "Data Types",
      items: [
        { id: "primitives", label: "Primitives", path: ROUTES.PRIMITIVES },
        { id: "strings", label: "Strings", path: ROUTES.STRINGS },
        { id: "vectors", label: "Vectors", path: ROUTES.VECTORS },
        { id: "tuples", label: "Tuples", path: ROUTES.TUPLES },
        { id: "structs", label: "Structs", path: ROUTES.STRUCTS },
        { id: "hashmaps", label: "HashMaps", path: ROUTES.HASHMAPS },
        { id: "hashsets", label: "HashSets", path: ROUTES.HASHSETS },
      ],
    },
    {
      title: "Functional Programming",
      items: [
        { id: "option", label: "Option", path: ROUTES.OPTION },
        { id: "result", label: "Result", path: ROUTES.RESULT },
        { id: "iter", label: "Iterators", path: ROUTES.ITER },
        {
          id: "functional",
          label: "Functional Utils",
          path: ROUTES.FUNCTIONAL,
        },
      ],
    },
    {
      title: "Concurrency & Memory",
      items: [
        {
          id: "sync-primitives",
          label: "Sync Primitives",
          path: ROUTES.SYNC_PRIMITIVES,
        },
        {
          id: "smart-pointers",
          label: "Smart Pointers",
          path: ROUTES.SMART_POINTERS,
        },
        { id: "ownership", label: "Ownership", path: ROUTES.OWNERSHIP },
        { id: "reference", label: "Reference", path: ROUTES.REFERENCE },
        { id: "resource", label: "Resource", path: ROUTES.RESOURCE },
      ],
    },
    {
      title: "Advanced Features",
      items: [
        { id: "computed", label: "Computed", path: ROUTES.COMPUTED },
        { id: "matching", label: "Pattern Matching", path: ROUTES.MATCHING },
        { id: "contract", label: "Contract", path: ROUTES.CONTRACT },
        { id: "async", label: "Async", path: ROUTES.ASYNC },
        { id: "async-utils", label: "Async Utils", path: ROUTES.ASYNC_UTILS },
      ],
    },
    {
      title: "Utilities",
      items: [
        { id: "branding", label: "Branded Types", path: ROUTES.BRANDING },
        { id: "common", label: "Common Utilities", path: ROUTES.COMMON },
        { id: "errors", label: "Errors", path: ROUTES.ERRORS },
      ],
    },
    {
      title: "System",
      items: [{ id: "status", label: "System Status", path: ROUTES.STATUS }],
    },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo>
          <LogoTitle>MiLost</LogoTitle>
          <LogoSubtitle>Rust-powered TypeScript</LogoSubtitle>
        </Logo>
        <CloseButton onClick={onClose} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </CloseButton>
      </div>

      <Nav>
        {navSections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {section.title && (
              <SectionDivider>
                <SectionTitle>{section.title}</SectionTitle>
              </SectionDivider>
            )}
            <NavList>
              {section.items.map((item) => (
                <li key={item.id}>
                  <StyledNavLink
                    to={item.path}
                    end={item.path === ROUTES.HOME}
                    onClick={onClose}
                  >
                    {item.label}
                  </StyledNavLink>
                </li>
              ))}
            </NavList>
          </React.Fragment>
        ))}
      </Nav>

      <Footer>
        <p>Version 1.0.33</p>
      </Footer>
    </SidebarContainer>
  );
}

export default Sidebar;
