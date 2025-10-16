import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    role: string
    name: string
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      name: string
      email?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    name: string
  }
}
