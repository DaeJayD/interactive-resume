import { imageResponse, publishedMediaBucket } from "@/lib/resume/media";
import { createAnonymousSupabaseClient } from "@/lib/supabase/anonymous";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = createAnonymousSupabaseClient();
  if (!client) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  return imageResponse(client, publishedMediaBucket, (await params).id, true);
}
