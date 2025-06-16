// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       email: string
//       name: string
//       role: string
//     }
//     accessToken: string
//   }

//   interface User {
//     role: string
//     accessToken: string
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role: string
//     accessToken: string
//   }
// }

// types/next-auth.d.ts
// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      farm?: string; // ✅ Add farm here
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    farm?: string; // ✅ Add farm here too
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    farm?: string;
    accessToken: string;
    refreshToken: string;
  }
}
