import { auth } from "@/auth"
import SignIn from "@/components/sign-in";

export default async function Login() {
  const session = await auth()

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Pantheon Technologies Login</h1>

      <SignIn></SignIn>

      <div>Name: {session?.user?.name}</div>

    </div>
  );
}