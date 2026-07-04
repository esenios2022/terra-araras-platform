import { getSession } from "@/lib/auth/session";
import { sql } from "@/lib/db";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const locale = await getLocale();
  const t = getDictionary(locale);

  const [user] = await sql`
    select role, subscription_status, access_status from users where id = ${session!.userId}
  `;

  const isAdmin = user?.role === "admin";
  const isApproved = isAdmin || user?.access_status === "approved";
  const isPremium = isAdmin || user?.subscription_status === "active";

  // Pending approval
  if (!isApproved) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white/70 p-8 text-center">
        <div className="text-4xl">🕊️</div>
        <h1 className="mt-4 text-xl font-bold text-terra-dark">
          {locale === "pt" ? "Aguardando aprovação" : "Esperando aprobación"}
        </h1>
        <p className="mt-2 text-terra-dark/70">
          {locale === "pt"
            ? "Sua conta foi criada com sucesso. Em breve Claudio irá revisar e liberar o seu acesso. Você receberá uma confirmação."
            : "Tu cuenta fue creada con éxito. En breve Claudio va a revisar y habilitar tu acceso. Vas a recibir una confirmación."}
        </p>
        <div className="mt-6">
          <WhatsAppButton locale={locale} />
        </div>
      </div>
    );
  }

  // Approved but no active subscription
  if (!isPremium) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <div className="rounded-2xl bg-white/70 p-8 text-center">
          <h1 className="text-2xl font-bold text-terra-dark">{t.dashboard.welcomeTitle}</h1>
          <p className="mt-2 text-terra-dark/70">
            {locale === "pt"
              ? "Você tem acesso ao conteúdo gratuito. Para acessar as ativações e meditações completas, ative sua assinatura."
              : "Tenés acceso al contenido gratuito. Para acceder a las activaciones y meditaciones completas, activá tu suscripción."}
          </p>
          <Link
            href="/dashboard/biblioteca"
            className="mt-4 inline-block rounded-full bg-terra px-6 py-2 text-sm font-semibold text-terra-sand hover:bg-terra-deep"
          >
            {t.nav.library}
          </Link>
        </div>
        <div className="rounded-2xl bg-white/70 p-8 text-center">
          <h2 className="text-lg font-semibold text-terra-dark">{t.dashboard.inactiveTitle}</h2>
          <p className="mt-2 text-terra-dark/70">{t.dashboard.inactiveText}</p>
          <p className="mt-1 text-sm text-terra-dark/60">{t.dashboard.priceLine}</p>
          <div className="mt-4">
            <WhatsAppButton locale={locale} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-bold text-terra-dark">{t.dashboard.welcomeTitle}</h1>
      <p className="mt-3 text-terra-dark/70">{t.dashboard.welcomeText}</p>
      <Link
        href="/dashboard/biblioteca"
        className="mt-6 inline-block rounded-full bg-terra px-6 py-2 font-semibold text-terra-sand hover:bg-terra-deep"
      >
        {t.nav.library}
      </Link>
    </div>
  );
}
