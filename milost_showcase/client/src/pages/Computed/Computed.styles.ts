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
  padding: 12px;
  margin-bottom: 16px;
  color: #0369a1;
  font-size: 14px;

  @media (max-width: 640px) {
    padding: 10px;
    font-size: 13px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;

  @media (max-width: 640px) {
    margin-bottom: 12px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
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

export const Pre = styled.pre`
  white-space: pre-wrap;
  word-break: break-word;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 14px;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const SmallText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 14px;

  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #e2e8f0;
  }

  th {
    background-color: #f8fafc;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    font-size: 12px;

    th,
    td {
      padding: 6px 8px;
    }
  }
`;
