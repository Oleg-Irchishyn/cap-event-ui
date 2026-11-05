import { clearTokens, getStoredIdToken } from './tokenStorage';
import { clearStoredSessionId } from './sessionIdStorage';
import { getOneLoginBaseUrl, getOneLoginConfig } from './oneloginAuth';
import { ROUTES } from '@/const/routes';

/**
 * Performs logout by clearing local storage and calling OneLogin logout endpoint
 * Then redirects to the login page
 */
export const logout = async (): Promise<void> => {
  const idToken = getStoredIdToken();

  clearTokens();
  clearStoredSessionId();

  try {
    const config = getOneLoginConfig();
    const baseUrl = getOneLoginBaseUrl(config);

    const logoutUrl = new URL(`${baseUrl}/oidc/2/logout`);

    if (idToken) {
      logoutUrl.searchParams.set('id_token_hint', idToken);
      const redirectUri =
        typeof window !== 'undefined'
          ? `${window.location.origin}/cap-event${ROUTES.LOGIN.path}?prompt_login=true`
          : `${ROUTES.LOGIN.path}?prompt_login=true`;
      logoutUrl.searchParams.set('post_logout_redirect_uri', redirectUri);
    }

    window.location.href = logoutUrl.toString();
  } catch (error) {
    console.error('Failed to call OneLogin logout endpoint:', error);
    if (typeof window !== 'undefined') {
      window.location.href = `${ROUTES.LOGIN.path}?prompt_login=true`;
    }
  }
};
