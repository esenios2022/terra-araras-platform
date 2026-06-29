import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { sql } from "@/lib/db";
import type { ContentItem } from "@/lib/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedContent } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const locale = await getLocale();
  const t = getDictionary(locale);

  const [user] = await sql`
    select role, subscription_status from users where id = ${session!.userId}
  `;

  const isActive = user?.role === "admin" || user?.subscription_status === "active";

  if (!isActive) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white/70 p-8 text-center">
        <h1 className="text-xl font-bold text-terra-dark">{t.dashboard.inactiveTitle}</h1>
        <p className="mt-2 text-terra-dark/70">{t.dashboard.inactiveText}</p>
        <p className="mt-1 text-sm text-terra-dark/60">{t.dashboard.priceLine}</p>
        <div className="mt-6">
          <WhatsAppButton locale={locale} />
        </div>
      </div>
    );
  }

  const items = (await sql`
    select * from content_items where is_published = true order by sort_order asc
  `) as ContentItem[];

  const videos = items.filter((i) => i.type === "video");
  const audios = items.filter((i) => i.type === "audio");

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-bold text-terra-dark">{t.dashboard.videos}</h2>
        <VideoGrid items={videos} locale={locale} emptyText={t.dashboard.emptyContent} />
      </section>
      <section>
        <h2 className="text-xl font-bold text-terra-dark">{t.dashboard.audios}</h2>
        <AudioList items={audios} locale={locale} emptyText={t.dashboard.emptyContent} />
      </section>
    </div>
  );
}

function VideoGrid({
  items,
  locale,
  emptyText,
}: {
  items: ContentItem[];
  locale: Locale;
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-terra-dark/60">{emptyText}</p>;
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const { title } = localizedContent(item, locale);
        return (
          <Link
            key={item.id}
            href={`/dashboard/content/${item.id}`}
            className="group overflow-hidden rounded-2xl bg-white/70 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-terra-dark/10">
              {item.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail_url}
                  alt={title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-terra-dark/30">
                  ▶
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-terra opacity-0 transition-opacity group-hover:opacity-100">
                  ▶
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-terra-dark">{title}</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-terra-gold">
                {item.category}
              </p>
              {item.duration_minutes && (
                <p className="mt-1 text-xs text-terra-dark/50">{item.duration_minutes} min</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function AudioList({
  items,
  locale,
  emptyText,
}: {
  items: ContentItem[];
  locale: Locale;
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-terra-dark/60">{emptyText}</p>;
  }

  return (
    <div className="mt-4 divide-y divide-terra/10 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
      {items.map((item) => {
        const { title, description } = localizedContent(item, locale);
        return (
          <Link
            key={item.id}
            href={`/dashboard/content/${item.id}`}
            className="flex items-center gap-4 p-4 hover:bg-white/90"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-terra/10 text-terra">
              ♪
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-terra-dark">{title}</h3>
              <p className="text-xs uppercase tracking-wide text-terra-gold">{item.category}</p>
              {description && (
                <p className="mt-1 truncate text-sm text-terra-dark/60">{description}</p>
              )}
            </div>
            {item.duration_minutes && (
              <span className="flex-none text-xs text-terra-dark/50">
                {item.duration_minutes} min
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
