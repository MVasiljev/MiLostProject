import styled from "@emotion/styled";

export const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
`;

export const IconLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconLink = styled.a`
  color: #64748b;
  transition: color 0.2s ease;
  display: flex;

  &:hover {
    color: #334155;
  }
`;

export const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  margin-right: 12px;
  border-radius: 4px;

  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
