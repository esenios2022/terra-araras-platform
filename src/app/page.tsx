import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main>
      <header className="flex items-center justify-between px-6 py-6 md:px-16">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/testimonios" className="px-2 text-sm font-medium hover:underline">
            {t.nav.testimonios}
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:underline">
            {t.nav.login}
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-terra px-5 py-2 text-sm font-medium text-terra-sand hover:bg-terra-deep"
          >
            {t.nav.signup}
          </Link>
          <LanguageToggle locale={locale} />
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center md:px-16">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          {t.landing.heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-terra-dark/80">
          {t.landing.heroSubtitle}
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-terra-gold px-8 py-3 text-base font-semibold text-terra-dark hover:opacity-90"
        >
          {t.landing.ctaStart}
        </Link>
      </section>

      {/* Comandos Cuánticos */}
      <section className="bg-terra-deep px-6 py-16 text-terra-sand md:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-terra-gold">
            {t.landing.quantumLead}
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.landing.quantumTitle}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-terra-sand/80">
            {t.landing.quantumDesc}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-6">
              <h3 className="text-xl font-bold">{t.landing.quantumFreeTitle}</h3>
              <p className="mt-2 text-terra-sand/80">{t.landing.quantumFreeText}</p>
            </div>
            <div className="rounded-2xl bg-terra-gold/20 p-6">
              <h3 className="text-xl font-bold">{t.landing.quantumPremiumTitle}</h3>
              <p className="mt-2 text-terra-sand/80">{t.landing.quantumPremiumText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 md:px-16">
        <h2 className="text-center text-2xl font-bold text-terra-dark">
          {t.landing.featuresTitle}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.landing.features.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white/60 p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-terra-dark/80">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-6 px-6 py-12 md:grid-cols-3 md:px-16">
        {t.landing.benefits.map((b) => (
          <div key={b.title} className="rounded-2xl bg-white/60 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{b.title}</h3>
            <p className="mt-2 text-sm text-terra-dark/80">{b.text}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 md:px-16" id="precios">
        <h2 className="text-center text-2xl font-bold text-terra-dark">
          {t.landing.pricingTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-terra-dark/70">
          {t.landing.pricingSubtitle}
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-terra-deep p-8 text-center text-terra-sand">
            <h3 className="text-lg font-semibold">{t.landing.uruguayLabel}</h3>
            <p className="mt-4 text-4xl font-bold">$555</p>
            <p className="text-terra-sand/70">{t.landing.uruguayUnit}</p>
          </div>
          <div className="rounded-3xl bg-terra-deep p-8 text-center text-terra-sand">
            <h3 className="text-lg font-semibold">{t.landing.brazilLabel}</h3>
            <p className="mt-4 text-4xl font-bold">R$44</p>
            <p className="text-terra-sand/70">{t.landing.brazilUnit}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-terra-gold">{t.landing.annualDiscountLabel}</p>
          <p className="mt-1 text-sm text-terra-dark/60">{t.landing.annualDiscountDetail}</p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/signup"
            className="inline-block rounded-full bg-terra-gold px-8 py-3 font-semibold text-terra-dark hover:opacity-90"
          >
            {t.landing.ctaCreateAccount}
          </Link>
          <WhatsAppButton locale={locale} />
        </div>
      </section>

      {/* Therapist profile */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-terra-gold">
            {t.landing.therapistLabel}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-terra-dark">Claudio Fabián Martínez</h2>
          <p className="mt-3 text-terra-dark/70">{t.landing.therapistBio}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://claudio-martinez-terapeuta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-terra-dark/30 px-5 py-2 text-sm font-semibold text-terra-dark hover:bg-terra-dark/5"
            >
              {t.landing.therapistProfileLink}
            </a>
            <WhatsAppButton locale={locale} />
            <a
              href="mailto:esenios2022@gmail.com"
              className="rounded-full border border-terra-dark/30 px-5 py-2 text-sm font-semibold text-terra-dark hover:bg-terra-dark/5"
            >
              {t.landing.therapistEmailLabel}
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-2 px-6 py-8 text-center text-sm text-terra-dark/60 md:px-16">
        <Link href="/testimonios" className="hover:underline">
          {t.landing.footerTestimonials}
        </Link>
        <span>© {new Date().getFullYear()} Terra Araras</span>
      </footer>
    </main>
  );
}
