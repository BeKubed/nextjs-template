import Image from "next/image";
import { signIn, signOut, auth } from "@/auth";


export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] w-full items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/logo_colour.svg"
          alt="BeKubed Logo"
          width={500}
          height={38}
          priority
        />

        <div className="flex gap-4 w-full items-center flex-col sm:flex-row">
          {!session?.user &&
            <form action={async () => {
              "use server"
              await signIn("zitadel", { redirectTo: "/dashboard" })
            }}>
              <button type="submit">Login</button>
            </form>}
          {session?.user &&
            <div className="w-full flex justify-between px-4">
              <h1 className="flex-1">Welcome back, {session.user.name}</h1>
              <form action={async () => {
                "use server"
                await signOut()
              }}>
                <button type="submit" className="text-primary">Logout</button>
              </form>
            </div>
          }
        </div>
      </main>
    </div>
  );
}
