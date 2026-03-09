export const logtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  cookieSecure: process.env.NODE_ENV === "production",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET || "complex_password_at_least_32_characters_long!!",
};
