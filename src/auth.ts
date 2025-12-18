import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
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