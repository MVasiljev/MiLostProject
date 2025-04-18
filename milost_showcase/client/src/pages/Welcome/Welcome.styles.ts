import styled from "@emotion/styled";

export const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (max-width: 640px) {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const TitleHighlight = styled.span`
  color: #d97706;
`;

export const Subtitle = styled.p`
  font-size: 20px;
  color: #64748b;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .feature-card {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: flex-start;

    @media (max-width: 640px) {
      padding: 16px;
    }

    .icon {
      margin-right: 16px;
      flex-shrink: 0;

      @media (max-width: 480px) {
        svg {
          width: 32px;
          height: 32px;
        }
      }
    }

    h3 {
      font-size: 18px;
      font-weight: 500;
      color: #1e293b;

      @media (max-width: 640px) {
        font-size: 16px;
      }
    }

    p {
      margin-top: 8px;
      color: #64748b;

      @media (max-width: 640px) {
        font-size: 14px;
      }
    }
  }
`;

export const CodeBlock = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const CodeBlockTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const CodeContent = styled.div`
  background-color: #1e293b;
  color: white;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
`;

export const Pre = styled.pre`
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 14px;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const SmallFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .feature-item {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #1e293b;
    }

    p {
      margin-top: 4px;
      font-size: 14px;
      color: #64748b;
    }
  }
`;

export const IntroText = styled.div`
  margin-bottom: 32px;
  font-size: 18px;
  color: #475569;
  line-height: 1.6;

  p {
    margin-bottom: 16px;
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const SectionDivider = styled.div`
  margin: 48px 0;
  text-align: center;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e2e8f0;
    z-index: 1;
  }

  span {
    background-color: #f8fafc;
    padding: 0 16px;
    position: relative;
    z-index: 2;
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
  }
`;

export const QuickLinks = styled.div`
  margin: 32px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;

  a {
    display: inline-block;
    padding: 10px 18px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #1e293b;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }
  }
`;

export const ContactLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d97706;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    font-size: 20px;
  }
`;
