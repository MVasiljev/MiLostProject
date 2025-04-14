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
} from "./Sidebar.styles";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", path: ROUTES.HOME },
    { id: "strings", label: "Strings", path: ROUTES.STRINGS },
    { id: "vectors", label: "Vectors", path: ROUTES.VECTORS },
    { id: "tuples", label: "Tuples", path: ROUTES.TUPLES },
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
        <NavList>
          {navItems.map((item) => (
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
      </Nav>

      <Footer>
        <p>Version 1.0.33</p>
      </Footer>
    </SidebarContainer>
  );
}

export default Sidebar;
