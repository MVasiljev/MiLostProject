import styled from "@emotion/styled";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  position: relative;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
