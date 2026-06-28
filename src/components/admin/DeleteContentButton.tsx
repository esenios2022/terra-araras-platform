"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteContentButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Borrar este contenido? No se puede deshacer.")) return;
    setLoading(true);
    await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-700 hover:underline disabled:opacity-60"
    >
      Borrar
    </button>
  );
}
