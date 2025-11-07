'use client';

import { createContext, PropsWithChildren, useContext } from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'styled-components';
import { ToastApi } from './types';

const ToastContext = createContext<ToastApi>({
  success: (message, options) => toast.success(message, options),
  error: (message, options) => toast.error(message, options),
  info: (message, options) => toast.info(message, options),
  warning: (message, options) => toast.warning(message, options),
});

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  return (
    <ToastContext.Provider
      value={{
        success: (message, options) => toast.success(message, options),
        error: (message, options) => toast.error(message, options),
        info: (message, options) => toast.info(message, options),
        warning: (message, options) => toast.warning(message, options),
      }}
    >
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        toastStyle={{ fontSize: 14, color: theme.colors.textPrimary, padding: 24 }}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
