import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

// Protect all routes except for /api, /_next/static, /_next/image, and favicon.ico
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] }