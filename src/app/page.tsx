import { auth } from "@/auth"
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";


export default async function Home() {
  const session = await auth()

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Pantheon Technologies</h1>

      <div>Landing</div>
      

    </div>
  );
}