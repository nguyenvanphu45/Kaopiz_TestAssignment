import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  registerFailure,
  registerStart,
  registerSuccess,
} from "../../store/ducks/auth/slice";
import { authApi } from "../../apis/auth";
import { clearAuthStorage, KEY_LOCAL_STORAGE, setLocalStorage } from "../../config/storage";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../interface/User";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (response) => {
      const { token, user, refreshToken } = response.data.data;

      dispatch(loginSuccess({ user, token }));

      setLocalStorage(KEY_LOCAL_STORAGE.ACCESS_TOKEN, token);
      setLocalStorage(KEY_LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
      setLocalStorage(KEY_LOCAL_STORAGE.USER_DATA, JSON.stringify(user));

      switch (user.type) {
        case UserType.ADMIN:
          navigate("/admin");
          break;
        case UserType.END_USER:
          navigate("/end-user");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message ?? "Login failed";
      dispatch(loginFailure(message));
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      dispatch(registerStart());
    },
    onSuccess: (response) => {
      const { token, user, refreshToken } = response.data.data;

      dispatch(
        registerSuccess({
          user: user,
          token: token,
        })
      );

      setLocalStorage(KEY_LOCAL_STORAGE.ACCESS_TOKEN, token);
      setLocalStorage(KEY_LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
      setLocalStorage(KEY_LOCAL_STORAGE.USER_DATA, JSON.stringify(user));

      switch (user.type) {
        case UserType.ADMIN:
          navigate("/admin");
          break;
        case UserType.END_USER:
          navigate("/end-user");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message ?? "Registration failed";
      dispatch(registerFailure(message));
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authApi.logout(refreshToken),
    onSuccess: () => {
      clearAuthStorage();
      dispatch(logout());
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      localStorage.setItem(KEY_LOCAL_STORAGE.ACCESS_TOKEN, data.token);
    },
  });
};
