import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 2rem;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #666;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const PrimaryButton = styled.button`
  background: #0066ff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

export const ResultContainer = styled.div`
  margin-top: 2rem;
`;

export const ResultTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

export const ResultContent = styled.div`
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
`;

export const Pre = styled.pre`
  white-space: pre-wrap;
  word-break: break-word;
`;

export const CodeBlock = styled.div`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
`;

export const SmallText = styled.p`
  font-size: 0.875rem;
  color: #777;
  margin-top: 1rem;
`;
