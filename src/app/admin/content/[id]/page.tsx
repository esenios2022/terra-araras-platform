import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import type { ContentItem } from "@/lib/types";
import ContentForm from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item] = (await sql`select * from content_items where id = ${id}`) as ContentItem[];

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-terra-dark">Editar contenido</h1>
      <div className="mt-4">
        <ContentForm initial={item} />
      </div>
    </div>
  );
}
