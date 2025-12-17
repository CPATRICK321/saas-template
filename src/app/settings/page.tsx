import { auth } from "@/auth"

export default async function Login() {
  const session = await auth()

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Pantheon Technologies Settings</h1>

    </div>
  );
}