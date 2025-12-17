import { auth } from "@/auth"
import SignOut from "@/components/sign-out";

export default async function Dashbaord() {
  const session = await auth()

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Pantheon Technologies Dashboard</h1>

      <SignOut></SignOut>

      <div>Name: {session?.user?.name}</div>

    </div>
  );
}