"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveUserButton({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: "pending" | "approved";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = currentStatus === "pending" ? "approved" : "pending";
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_status: next }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
        currentStatus === "pending"
          ? "bg-terra-gold text-terra-dark hover:opacity-80"
          : "bg-white/60 text-terra-dark hover:bg-white"
      }`}
    >
      {loading ? "..." : currentStatus === "pending" ? "Aprobar acceso" : "Revocar acceso"}
    </button>
  );
}
