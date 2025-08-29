import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import BackgroundContainer from '../index';
import { theme } from '@/ui/globalStyles';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('BackgroundContainer', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      const testContent = 'Test content';

      renderWithTheme(
        <BackgroundContainer>
          <div>{testContent}</div>
        </BackgroundContainer>,
      );

      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('should render multiple children correctly', () => {
      const firstChild = 'First child';
      const secondChild = 'Second child';

      renderWithTheme(
        <BackgroundContainer>
          <div>{firstChild}</div>
          <span>{secondChild}</span>
        </BackgroundContainer>,
      );

      expect(screen.getByText(firstChild)).toBeInTheDocument();
      expect(screen.getByText(secondChild)).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should apply default background color when background is not provided', () => {
      const testId = 'background-container';

      renderWithTheme(
        <BackgroundContainer testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);
      expect(container).toHaveStyle(`background-color: ${theme.colors.lightGray}`);
    });

    it('should apply custom background color when background is provided', () => {
      const customColor = '#FF5733';
      const testId = 'background-container';

      renderWithTheme(
        <BackgroundContainer background={customColor} testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);
      expect(container).toHaveStyle(`background-color: ${customColor}`);
    });

    it('should apply testId as data-testid attribute when provided', () => {
      const testId = 'custom-test-id';

      renderWithTheme(
        <BackgroundContainer testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('should not have data-testid attribute when testId is not provided', () => {
      renderWithTheme(
        <BackgroundContainer>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByText('Content').parentElement;
      expect(container).not.toHaveAttribute('background-container');
    });
  });

  describe('Styling', () => {
    it('should apply correct default styles from styled component', () => {
      const testId = 'styled-container';

      renderWithTheme(
        <BackgroundContainer testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);

      expect(container).toHaveStyle('position: relative');
      expect(container).toHaveStyle('border-radius: 16px');
      expect(container).toHaveStyle('margin: 24px 16px 0 16px');
      expect(container).toHaveStyle('padding: 24px');
    });

    it('should maintain styling with custom background color', () => {
      const customColor = '#123456';
      const testId = 'styled-container';

      renderWithTheme(
        <BackgroundContainer background={customColor} testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);

      expect(container).toHaveStyle('position: relative');
      expect(container).toHaveStyle('border-radius: 16px');
      expect(container).toHaveStyle('margin: 24px 16px 0 16px');
      expect(container).toHaveStyle('padding: 24px');
      expect(container).toHaveStyle(`background-color: ${customColor}`);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const testId = 'empty-container';

      renderWithTheme(<BackgroundContainer testId={testId}>{null}</BackgroundContainer>);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('should handle undefined background (fallback to default)', () => {
      const testId = 'undefined-color';

      renderWithTheme(
        <BackgroundContainer background={undefined} testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);
      expect(container).toHaveStyle(`background-color: ${theme.colors.lightGray}`);
    });

    it('should handle empty string background', () => {
      const testId = 'empty-color';

      renderWithTheme(
        <BackgroundContainer background="" testId={testId}>
          <div>Content</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);
      expect(container).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });

    it('should handle complex children with nested components', () => {
      const testId = 'complex-container';

      renderWithTheme(
        <BackgroundContainer testId={testId}>
          <div>
            <h1>Title</h1>
            <p>Paragraph content</p>
            <button>Click me</button>
          </div>
        </BackgroundContainer>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work correctly with all props provided', () => {
      const testId = 'full-props-container';
      const customColor = '#ABCDEF';
      const content = 'Full integration test';

      renderWithTheme(
        <BackgroundContainer background={customColor} testId={testId}>
          <div>{content}</div>
        </BackgroundContainer>,
      );

      const container = screen.getByTestId(testId);

      expect(container).toBeInTheDocument();
      expect(container).toHaveStyle(`background-color: ${customColor}`);
      expect(container).toHaveStyle('position: relative');
      expect(container).toHaveStyle('border-radius: 16px');
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });
});
