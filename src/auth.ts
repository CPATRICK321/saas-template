import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true, // TODO: disable in production
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
          return null
        }

        return user
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // 1. When creating the token, attach the user's ID
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id // "token.sub" is is the ID field in JWTs
        }
        return token
    },
    // 2. When the frontend checks the session, transfer the JWT ID to session.user
    async session({ session, token }) {
        if (session.user && token.sub) {
            session.user.id = token.sub
        }
        return session
    }
  }
})