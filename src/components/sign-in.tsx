import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
            }}>
                <Button type="submit">Sign in with GitHub</Button>
        </form>
    )
}