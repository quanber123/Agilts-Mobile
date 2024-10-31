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
  useGetUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useVerifyTwoFactorMutation,
} from '@/services/redux/query/appQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, userState } from '@/services/redux/slice/userSlice';
import { User } from '@/types/types';
import { router } from 'expo-router';
import { AlterContext } from './AlterProvider';
type CTX = {
  user: User | null;
  getUser: () => Promise<void>;
  updateUser: ({
    name,
    email,
    phone_number,
    birthday,
    gender,
  }: {
    name: string;
    email: string;
    phone_number: string;
    birthday: string;
    gender: number;
  }) => Promise<void>;
  signUp: ({
    email,
    password,
    name,
    password_confirmation,
  }: {
    email: string;
    password: string;
    name: string;
    password_confirmation: string;
  }) => Promise<void>;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  verify2Fa: (isCode: boolean, code: string) => Promise<void>;
  session: string | null;
  isLoadingSession: boolean;
  isLoadingCsrfCookie: boolean;
  isLoadingUser: boolean;
  isLoadingUpdate: boolean;
  isSuccessUpdate: boolean;
  isLoadingRegister: boolean;
  isLoadingLogin: boolean;
  isLoadingLogout: boolean;
  isLoadingVerify2Fa: boolean;
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
  const [[isLoadingSession, session], setSession] =
    useStorageState('x-user-session');
  const user = useSelector(userState);
  const dispatch = useDispatch();
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(
    null
  );
  const [getCsrfCookie, { isLoading: isLoadingCsrfCookie }] =
    useGetCSRFCookieMutation();
  const [
    getUser,
    {
      data: userData,
      isLoading: isLoadingUser,
      isSuccess: isSuccessUser,
      isError: isErrorUser,
      error: errorUser,
    },
  ] = useGetUserMutation();
  const [
    register,
    {
      data: registerData,
      isLoading: isLoadingRegister,
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      error: errorRegister,
    },
  ] = useRegisterMutation();
  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();
  const [
    login,
    {
      data: loginData,
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

  const [
    verify,
    {
      data: verifyData2Fa,
      isLoading: isLoadingVerify2Fa,
      isSuccess: isSuccessVerify2Fa,
      isError: isErrorVerify2Fa,
      error: errorVerify2Fa,
    },
  ] = useVerifyTwoFactorMutation();
  const handleSignUp = useCallback(
    async ({
      email,
      password,
      name,
      password_confirmation,
    }: {
      email: string;
      password: string;
      name: string;
      password_confirmation: string;
    }) => {
      await getCsrfCookie(null);
      await register({ email, password, name, password_confirmation });
    },
    [getCsrfCookie, register]
  );
  const handleUpdate = useCallback(
    async ({
      name,
      email,
      phone_number,
      birthday,
      gender,
    }: {
      name: string;
      email: string;
      phone_number: string;
      birthday: string;
      gender: number;
    }) => {
      await getCsrfCookie(null);
      await updateUser({ name, email, phone_number, birthday, gender });
    },
    [getCsrfCookie, updateUser]
  );
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
  const handleVerify2Fa = useCallback(
    async (isCode: boolean, code: string) => {
      await verify(
        isCode
          ? {
              code: code,
            }
          : {
              recovery_code: code,
            }
      );
    },
    [verifyData2Fa, verify]
  );
  const handleGetUser = useCallback(async () => {
    await getCsrfCookie(null);
    await getUser(session);
  }, [getUser]);
  useEffect(() => {
    const fetchData = async () => {
      await getCsrfCookie(null);
    };
    fetchData();
  }, []);
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
    if (isSuccessUpdate) {
      async () => {
        await handleGetUser();
      };
    }
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      setErrorResponse({
        type: 'update',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
      setSession(null);
    }
  }, [isSuccessUpdate, registerData, isErrorUpdate, errorUpdate]);
  useEffect(() => {
    if (isSuccessRegister && registerData) {
      setSession(registerData?.token);
      setErrorResponse(null);
    }
    if (isErrorRegister && errorRegister) {
      const error = errorRegister as any;
      setErrorResponse({
        type: 'register',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
      setSession(null);
    }
  }, [isSuccessRegister, registerData, isErrorRegister, errorRegister]);
  useEffect(() => {
    if (isSuccessLogin && loginData) {
      if (loginData?.two_factor) {
        setSession(null);
        router.push('/two-factor');
      } else {
        setSession(loginData?.token);
      }
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
  }, [isSuccessLogin, loginData, isErrorLogin, errorLogin]);
  useEffect(() => {
    if ((isSuccessLogin && !loginData?.two_factor) || session) {
      handleGetUser();
    }
    if (isSuccessLogin && loginData?.two_factor && !session) {
      router.push('/two-factor');
    }
  }, [isSuccessLogin, loginData, session, router]);
  useEffect(() => {
    if (isSuccessUser && userData) {
      dispatch(setUser(userData));
      router.replace('/');
    }
  }, [isSuccessUser, userData, router, dispatch]);
  useEffect(() => {
    if (isSuccessLogout) {
      setSession(null);
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
  }, [isSuccessLogout, isErrorLogout, errorLogout]);
  useEffect(() => {
    if (isSuccessVerify2Fa && verifyData2Fa) {
      setSession(verifyData2Fa?.token);
      setErrorResponse(null);
    }
    if (isErrorVerify2Fa && errorVerify2Fa) {
      const error = errorVerify2Fa as any;
      setErrorResponse({
        type: 'verify',
        errors: error?.data?.errors,
        message: error?.data?.message,
      });
      setSession(null);
    }
  }, [isSuccessVerify2Fa, verifyData2Fa, isErrorVerify2Fa, errorVerify2Fa]);
  return (
    <AuthContext.Provider
      value={{
        user: user,
        getUser: handleGetUser,
        updateUser: handleUpdate,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        verify2Fa: handleVerify2Fa,
        session,
        isLoadingSession,
        isLoadingCsrfCookie,
        isLoadingUpdate,
        isSuccessUpdate,
        isLoadingRegister,
        isLoadingLogin,
        isLoadingLogout,
        isLoadingVerify2Fa,
        isLoadingUser,
        errorResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
