import { logout } from '@/utils/logout';
import Button, { BUTTON_THEMES } from '@/app/components/Button';

const LogoutButton = () => {
  return (
    <Button width="auto" onClick={logout} buttonTheme={BUTTON_THEMES.text} testId="logout">
      Logout
    </Button>
  );
};

export default LogoutButton;
