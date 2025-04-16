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

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 1px #d97706;
  }

  @media (max-width: 640px) {
    font-size: 14px;
    padding: 6px 10px;
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

export const OperationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

export const OperationButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#d97706" : "#f1f5f9")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#b45309" : "#e2e8f0")};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 1px #d97706;
  }

  @media (max-width: 640px) {
    font-size: 14px;
    padding: 6px 10px;
  }
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

export const PrimaryButton = styled.button`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: #d97706;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #b45309;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: #1e293b;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0f172a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const ResultContainer = styled.div`
  margin-top: 24px;

  @media (max-width: 640px) {
    margin-top: 16px;
  }
`;

export const ResultTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 16px;
    margin-bottom: 6px;
  }
`;

export const ResultContent = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;

  @media (max-width: 640px) {
    padding: 12px;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #ef4444;

  @media (max-width: 640px) {
    margin-top: 12px;
    padding: 8px;
    font-size: 14px;
  }
`;

export const SelectInput = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 1px #d97706;
  }

  @media (max-width: 640px) {
    font-size: 14px;
    padding: 6px 10px;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;
