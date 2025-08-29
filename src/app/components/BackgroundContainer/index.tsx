import { FC, PropsWithChildren } from 'react';
import { BackgroundContainerWrapper } from './styles';
import { theme } from '@/ui/globalStyles';

type BackgroundContainerProps = {
  background?: string;
  testId?: string;
};

const BackgroundContainer: FC<PropsWithChildren<BackgroundContainerProps>> = ({
  children,
  testId = 'background-container',
  background,
}) => {
  const backgroundColor = background ?? theme.colors.lightGray;
  return (
    <BackgroundContainerWrapper data-testid={testId} $background={backgroundColor}>
      {children}
    </BackgroundContainerWrapper>
  );
};

export default BackgroundContainer;
