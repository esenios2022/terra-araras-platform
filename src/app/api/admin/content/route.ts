import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { sql } from "@/lib/db";
import { extractVimeoId, fetchVimeoThumbnail } from "@/lib/vimeo";

function extractDriveId(url: string): string | null {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const {
    title, description, title_pt, description_pt,
    type, category, duration_minutes,
    vimeo_id, audio_path, drive_url, tier,
    is_published, sort_order,
  } = body;

  const cleanVimeoId = vimeo_id ? extractVimeoId(vimeo_id) : null;
  const thumbnailUrl = cleanVimeoId ? await fetchVimeoThumbnail(cleanVimeoId) : null;
  const cleanDriveId = drive_url ? extractDriveId(drive_url) : null;
  const normalizedDriveUrl = cleanDriveId
    ? `https://drive.google.com/file/d/${cleanDriveId}/preview`
    : null;

  const [item] = await sql`
    insert into content_items
      (title, description, title_pt, description_pt, type, category,
       duration_minutes, vimeo_id, audio_path, drive_url, tier,
       thumbnail_url, is_published, sort_order, created_by)
    values
      (${title}, ${description}, ${title_pt}, ${description_pt}, ${type}, ${category},
       ${duration_minutes}, ${cleanVimeoId}, ${audio_path}, ${normalizedDriveUrl}, ${tier ?? "premium"},
       ${thumbnailUrl}, ${is_published}, ${sort_order}, ${admin.userId})
    returning id
  `;

  return NextResponse.json({ id: item.id });
}
