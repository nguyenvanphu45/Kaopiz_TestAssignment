export const UserType = {
  PARTNER: 1,
  ADMIN: 2,
  END_USER: 3
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export interface User {
  id: string;
  username: string;
  email: string;
  userType: UserType;
}