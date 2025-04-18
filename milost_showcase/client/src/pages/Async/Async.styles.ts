import styled from "@emotion/styled";

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const Header = styled.div`
  margin-bottom: 32px;

  @media (max-width: 640px) {
    margin-bottom: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  color: #64748b;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    padding: 16px;
    margin-bottom: 24px;
  }
`;

export const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    margin-bottom: 16px;
  }
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#d97706" : "#64748b")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "#d97706" : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${(props) => (props.active ? "#d97706" : "#1e293b")};
  }

  @media (max-width: 640px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

export const InfoBox = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  color: #0369a1;
`;

export const CodeBlock = styled.div`
  background-color: #1e293b;
  color: white;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;
