import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Preencha todos os campos.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("Usuário não encontrado.")

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        )
        if (!isPasswordValid) throw new Error("Senha incorreta.")

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id)
        token.role = user.role
        token.name = user.name
        token.email = user.email
        token.phone = user.phone
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          phone: token.phone as string,
        }
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
