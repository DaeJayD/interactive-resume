import { redirect } from "next/navigation";
import { isResumeOwner } from "@/lib/resume/owner";
import { supabaseConfig } from "@/lib/supabase/config";
import { createSupabaseClient } from "@/lib/supabase/server";
import { signIn } from "../actions";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const configured = Boolean(supabaseConfig());
  if (configured && await isResumeOwner(await createSupabaseClient())) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-lg">
      <h1>Résumé admin</h1>
      {!configured ? (
        <p className="mt-4">Connect a Supabase project to enable owner login.</p>
      ) : (
        <form action={signIn} className="mt-6 grid gap-4">
          {error === "credentials" && <p role="alert">Could not sign in with those credentials.</p>}
          <label className="grid gap-1 text-sm">
            Email
            <input className="rounded border bg-white p-2" type="email" name="email" autoComplete="username" required />
          </label>
          <label className="grid gap-1 text-sm">
            Password
            <input className="rounded border bg-white p-2" type="password" name="password" autoComplete="current-password" required />
          </label>
          <button className="print-resume justify-self-start" type="submit">Sign in</button>
        </form>
      )}
    </main>
  );
}
