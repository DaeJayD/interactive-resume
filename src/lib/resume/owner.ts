import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

type Client = Awaited<ReturnType<typeof createSupabaseClient>>;

export async function isResumeOwner(client: Client) {
  const { data: auth, error: authError } = await client.auth.getClaims();
  if (authError || !auth?.claims.sub) return false;

  const { data, error } = await client
    .from("resume_owner")
    .select("user_id")
    .eq("user_id", auth.claims.sub)
    .maybeSingle();
  if (error) throw new Error("Could not verify résumé ownership");
  return Boolean(data);
}

export async function requireResumeOwner() {
  if (!supabaseConfig()) redirect("/admin/login");
  const client = await createSupabaseClient();
  if (!(await isResumeOwner(client))) redirect("/admin/login");
  return client;
}
