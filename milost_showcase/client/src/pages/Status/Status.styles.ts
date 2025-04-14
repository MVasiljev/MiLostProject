/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
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

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    gap: 16px;
    margin-bottom: 16px;
  }
`;

export const StatusCard = styled.div<{
  status: "success" | "error" | "warning" | "info";
}>`
  background-color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#f0fdf4";
      case "error":
        return "#fef2f2";
      case "warning":
        return "#fffbeb";
      case "info":
        return "#f0f9ff";
      default:
        return "white";
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.status) {
        case "success":
          return "#dcfce7";
        case "error":
          return "#fee2e2";
        case "warning":
          return "#fef3c7";
        case "info":
          return "#e0f2fe";
        default:
          return "#e2e8f0";
      }
    }};
  border-radius: 6px;
  padding: 16px;
  position: relative;
  overflow: hidden;
`;

export const StatusCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

export const StatusIndicator = styled.div<{
  status: "success" | "error" | "warning" | "info";
}>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#94a3b8";
    }
  }};
`;

export const StatusValue = styled.div`
  font-size: 14px;
  color: #64748b;
`;

export const Badge = styled.span<{
  status: "success" | "error" | "warning" | "info";
}>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#dcfce7";
      case "error":
        return "#fee2e2";
      case "warning":
        return "#fef3c7";
      case "info":
        return "#e0f2fe";
      default:
        return "#f1f5f9";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  }};
`;

export const ModuleCard = styled.div`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const ModuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const ModuleName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
`;

export const ModuleStatus = styled.div`
  font-size: 14px;
  color: #64748b;
`;

export const ModuleDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
`;

export const MethodsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
`;

export const Method = styled.div<{ available: boolean }>`
  font-size: 13px;
  color: ${(props) => (props.available ? "#10b981" : "#94a3b8")};
  padding: 4px 8px;
  background-color: ${(props) => (props.available ? "#f0fdf4" : "#f8fafc")};
  border-radius: 4px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 6px;
    flex-shrink: 0;
  }
`;

export const RefreshButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  svg {
    margin-right: 8px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`;

export const TableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
`;

export const TableCell = styled.td`
  padding: 10px 16px;
  font-size: 14px;
  color: #1e293b;
`;

export const ExportsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 16px;
`;

export const ExportItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  font-family: monospace;

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }

  &:nth-of-type(even) {
    background-color: #f8fafc;
  }
`;

export const Pre = styled.pre`
  white-space: pre-wrap;
  word-break: break-word;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  overflow-x: auto;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Error = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  color: #b91c1c;
`;
