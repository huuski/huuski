export const AUTH_COOKIE = "dealdeck-auth";
export const ACCESS_TOKEN_COOKIE = "dealdeck-access-token";
export const REFRESH_TOKEN_COOKIE = "dealdeck-refresh-token";
export const USER_COOKIE = "dealdeck-user";

export const demoUser = {
  name: "Ferra Alexandra",
  email: "demo@dealdeck.io",
  role: "Admin Store",
};

const demoPassword = "password123";

export function validateCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === demoUser.email &&
    password.trim() === demoPassword
  );
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
};

