export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  userType: number;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    userType: number;
  };
  token: string;
}
