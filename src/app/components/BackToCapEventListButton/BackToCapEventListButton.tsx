import { FC } from 'react';
import styled from 'styled-components';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { ROUTES } from '@/const/routes';
import { useRouter } from 'next/navigation';

interface BackToCapEventListButtonProps {
  isFormClean: boolean;
  onOpenConfirmationModal: () => void;
}

const BackIcon = styled.img.attrs({
  src: '/cap-event/icons/back.svg',
})({
  width: '18px',
  height: '16px',
  padding: '4px 3px',
  marginLeft: '10px',
});

const BackToCapEventListButton: FC<BackToCapEventListButtonProps> = ({
  isFormClean,
  onOpenConfirmationModal,
}) => {
  const router = useRouter();
  const handleBackClick = () => {
    if (isFormClean) {
      router.push(ROUTES.MAIN.path);
    } else {
      onOpenConfirmationModal();
    }
  };
  return (
    <Button
      testId="back"
      width="auto"
      onClick={handleBackClick}
      buttonTheme={BUTTON_THEMES.text}
      textStyle={{ alignItems: 'center' }}
    >
      Back to Capital Event List
      <BackIcon />
    </Button>
  );
};

export default BackToCapEventListButton;
