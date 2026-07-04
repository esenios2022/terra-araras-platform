import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { sql } from "@/lib/db";
import type { ContentItem } from "@/lib/types";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedContent } from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

export default async function BibliotecaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale);

  const [user] = await sql`
    select role, subscription_status, access_status from users where id = ${session.userId}
  `;
  const isAdmin = user?.role === "admin";
  const isApproved = isAdmin || user?.access_status === "approved";
  const isPremium = isAdmin || user?.subscription_status === "active";

  if (!isApproved) redirect("/dashboard");

  // Free content visible to all approved users; premium only for active subscribers
  const items = (await sql`
    select * from content_items
    where is_published = true
      and (tier = 'free' or ${isPremium})
    order by sort_order asc
  `) as ContentItem[];

  const videos = items.filter((i) => i.type === "video");
  const audios = items.filter((i) => i.type === "audio");

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full flex-none space-y-6 md:w-64">
        <div>
          <h2 className="px-2 text-xs font-bold uppercase tracking-wide text-terra-gold">
            {t.dashboard.videos}
          </h2>
          <nav className="mt-2 space-y-1">
            {videos.map((item) => {
              const { title } = localizedContent(item, locale);
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/biblioteca/${item.id}`}
                  className="block truncate rounded-lg px-2 py-1.5 text-sm text-terra-dark hover:bg-white/70"
                >
                  {title}
                </Link>
              );
            })}
            {videos.length === 0 && (
              <p className="px-2 text-xs text-terra-dark/50">{t.dashboard.emptyContent}</p>
            )}
          </nav>
        </div>
        <div>
          <h2 className="px-2 text-xs font-bold uppercase tracking-wide text-terra-gold">
            {t.dashboard.audios}
          </h2>
          <nav className="mt-2 space-y-1">
            {audios.map((item) => {
              const { title } = localizedContent(item, locale);
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/biblioteca/${item.id}`}
                  className="block truncate rounded-lg px-2 py-1.5 text-sm text-terra-dark hover:bg-white/70"
                >
                  ♪ {title}
                </Link>
              );
            })}
            {audios.length === 0 && (
              <p className="px-2 text-xs text-terra-dark/50">{t.dashboard.emptyContent}</p>
            )}
          </nav>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
