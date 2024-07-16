import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import {
  useGetCSRFCookieMutation,
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from '@/services/redux/query/appQuery';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsLoggedIn,
  setUser,
  userState,
} from '@/services/redux/slice/userSlice';
import { User } from '@/types/types';
import { router } from 'expo-router';
type CTX = {
  user: User | null;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoadingSession: boolean;
  isLoadingCsrfCookie: boolean;
  isLoadingUser: boolean;
  isLoadingLogin: boolean;
  isLoadingLogout: boolean;
  errorResponse: any;
};
const AuthContext = createContext<CTX>({} as CTX);

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}
type ErrorResponse = {
  type: string;
  errors: any;
  message: string;
};
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingSession, session], setSession] = useStorageState('session');
  const user = useSelector(userState);
  const dispatch = useDispatch();
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(
    null
  );
  const [getCsrfCookie, { isLoading: isLoadingCsrfCookie }] =
    useGetCSRFCookieMutation();
  const {
    data: userData,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
    error: errorUser,
  } = useGetUserQuery(null, {
    skip: !session,
  });
  const [
    login,
    {
      isLoading: isLoadingLogin,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin,
    },
  ] = useLoginMutation();
  const [
    logout,
    {
      isLoading: isLoadingLogout,
      isSuccess: isSuccessLogout,
      isError: isErrorLogout,
      error: errorLogout,
    },
  ] = useLogoutMutation();
  const handleSignIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      await getCsrfCookie(null);
      await login({ email, password });
    },
    [getCsrfCookie, login]
  );
  const handleSignOut = useCallback(async () => {
    await logout(null);
  }, [logout]);
  useEffect(() => {
    if (isSuccessUser && userData) {
      setErrorResponse(null);
      dispatch(setUser(userData));
      router.replace('/');
    }
    if (isErrorUser && errorUser) {
      const error = errorUser as any;
      setSession(null);
      setErrorResponse({
        type: 'user',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
    }
  }, [isSuccessUser, userData, isErrorUser, errorUser, dispatch, router]);
  useEffect(() => {
    if (isSuccessLogin) {
      router.replace('/');
      setSession('x-user-session');
      dispatch(setIsLoggedIn(true));
      setErrorResponse(null);
    }
    if (isErrorLogin && errorLogin) {
      const error = errorLogin as any;
      setErrorResponse({
        type: 'login',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
      setSession(null);
    }
  }, [isSuccessLogin, isErrorLogin, errorLogin, dispatch, router]);
  useEffect(() => {
    if (isSuccessLogout) {
      setSession(null);
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      setErrorResponse(null);
    }
    if (isErrorLogout && errorLogout) {
      const error = errorLogout as any;
      setErrorResponse({
        type: 'logout',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
    }
  }, [isSuccessLogout, isErrorLogout, errorLogout, dispatch]);
  console.log(user, errorLogin, isSuccessLogin, isErrorLogin);
  return (
    <AuthContext.Provider
      value={{
        user: user,
        signIn: handleSignIn,
        signOut: handleSignOut,
        session,
        isLoadingSession,
        isLoadingCsrfCookie,
        isLoadingLogin,
        isLoadingLogout,
        isLoadingUser,
        errorResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
