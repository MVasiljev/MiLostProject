import styled from "@emotion/styled";

export const ValidatorConfigContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ValidatorTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const OperationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

export const ResultPreview = styled.pre`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 14px;
  margin-top: 16px;

  @media (max-width: 640px) {
    padding: 12px;
    font-size: 12px;
  }
`;
