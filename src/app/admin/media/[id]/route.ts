import { isResumeOwner } from "@/lib/resume/owner";
import { draftMediaBucket, imageResponse } from "@/lib/resume/media";
import { supabaseConfig } from "@/lib/supabase/config";
import { createSupabaseClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const missing = () => new Response(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  if (!supabaseConfig()) return missing();
  const client = await createSupabaseClient();
  if (!(await isResumeOwner(client))) return missing();
  return imageResponse(client, draftMediaBucket, (await params).id, false);
}
