"use server";

import { redirect } from "next/navigation";
import { resume } from "@/data/resume";
import { isResumeOwner, requireResumeOwner } from "@/lib/resume/owner";
import { resumeSchema } from "@/lib/resume/schema";
import { supabaseConfig } from "@/lib/supabase/config";
import { createSupabaseClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  if (!supabaseConfig()) redirect("/admin/login");

  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" ||
      !email.trim() || email.length > 254 || !password || password.length > 1024) {
    redirect("/admin/login?error=credentials");
  }

  const client = await createSupabaseClient();
  const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) redirect("/admin/login?error=credentials");
  if (!(await isResumeOwner(client))) {
    await client.auth.signOut({ scope: "local" });
    redirect("/admin/login?error=credentials");
  }
  redirect("/admin");
}

export async function signOut() {
  const client = await requireResumeOwner();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw new Error("Could not sign out");
  redirect("/admin/login");
}

export async function importResume() {
  const client = await requireResumeOwner();
  const document = resumeSchema.parse(resume);
  const { error } = await client.from("resume_drafts").insert({ document });
  if (error && error.code !== "23505") throw new Error("Could not import résumé");
  redirect("/admin");
}
