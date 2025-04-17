import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 250px;
  background-color: #1e2a38;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 50;

  @media (max-width: 768px) {
    position: fixed;
    left: ${(props) => (props.isOpen ? "0" : "-250px")};
    transition: left 0.3s ease;
    top: 0;
    bottom: 0;
  }
`;

export const Logo = styled.div`
  padding: 16px;
`;

export const LogoTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #f59e0b;
`;

export const LogoSubtitle = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
`;

export const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;

  /* Hide scrollbar for Webkit-based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for other browsers */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const NavList = styled.ul`
  margin: 0;
  padding: 8px;
  list-style: none;
`;

export const StyledNavLink = styled(NavLink)`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 15px;

  &:hover {
    background-color: #334155;
  }

  &.active {
    background-color: #d97706;
    color: white;
  }
`;

export const Footer = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #94a3b8;
`;

export const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;

  &:hover {
    color: white;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

export const SectionDivider = styled.div`
  padding: 12px 16px 4px;
  margin-top: 8px;
  border-top: 1px solid #334155;
`;

export const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;
