// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      farm: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    role: string;
    farm: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    farm: string;
    accessToken: string;
    refreshToken: string;
  }
}
