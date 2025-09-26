import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  useLogin,
  useLogout,
  useRefreshToken,
  useRegister,
} from "./api/useAuthMutation";
import { clearAuthStorage } from "../config/storage";
import { logout } from "../store/ducks/auth/slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  const isLoading =
    authState.loading || loginMutation.isPending || registerMutation.isPending;

  const handleLogout  = () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      logoutMutation.mutate(refreshToken);
    } else {
      clearAuthStorage();
      dispatch(logout());
    }
  };



  return {
    // Redux State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    loading: isLoading,

    // Mutation Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    refreshToken: refreshTokenMutation.mutate,
  };
};
