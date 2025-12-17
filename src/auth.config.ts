import type { NextAuthConfig } from "next-auth"


export const authConfig = {
    pages: {
        // where to redirect for sign in
        signIn: '/login',
        // where to redirect after sign out
        signOut: '/',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            
            if (isLoggedIn) {
                if (nextUrl.pathname === '/'
                    || nextUrl.pathname === '/dashboard'
                    || nextUrl.pathname === '/settings') {
                    // logged in users are allowed to access these pages
                    return true
                } else {
                    // logged in users should redirect to the dashboard for other pages
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
            }
            if (nextUrl.pathname === '/'
                    || nextUrl.pathname === '/login') {
                    // logged out usedrs are allowed to access these pages
                    return true
                } else {
                    // logged out users should redirect to the login for other pages
                    return false
            }
        }
    },
    providers: [],
} satisfies NextAuthConfig