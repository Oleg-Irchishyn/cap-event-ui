import Button, { BUTTON_THEMES } from '@/app/components/Button';

const DeleteButton = () => {
  return (
    <Button
      style={{ display: 'none' }}
      testId="delete"
      disabled
      width="auto"
      onClick={() => {}}
      buttonTheme={BUTTON_THEMES.secondary}
    >
      Delete Capital Event
    </Button>
  );
};

export default DeleteButton;
