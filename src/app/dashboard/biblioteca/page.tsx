import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function BibliotecaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center rounded-2xl bg-white/50 p-8 text-center">
      <p className="text-terra-dark/60">{t.dashboard.selectFromMenu}</p>
    </div>
  );
}
