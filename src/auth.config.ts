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
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/settings')
            const isOnSettings = nextUrl.pathname.startsWith('/settings')
            const isOnAuth = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'
            const isOnPublic = nextUrl.pathname === '/'

            
            if (isLoggedIn) {
                // logged in users don't need to see auth pages
                if (isOnAuth) {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
                
                if (isOnDashboard || isOnSettings || isOnPublic) {
                    return true
                }

                // logged in users should redirect to dashboard for other pages
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            
            // Logged out users can access public pages
            if (isOnAuth || isOnPublic) {
                return true
            }

            // everything else is directed to login
            return false
        }
    },
    providers: [],
} satisfies NextAuthConfig