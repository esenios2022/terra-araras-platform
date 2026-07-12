import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { sql } from "@/lib/db";
import { getLocale } from "@/lib/i18n/get-locale";

export const dynamic = "force-dynamic";

const TIPOS = {
  ACT: { es: "Activación",      pt: "Ativação",        color: "bg-emerald-700/80 text-white" },
  MED: { es: "Meditación",      pt: "Meditação",       color: "bg-teal-700/80 text-white" },
  REP: { es: "Reprogramación",  pt: "Reprogramação",   color: "bg-yellow-700/80 text-white" },
  CMD: { es: "Comando",         pt: "Comando",         color: "bg-amber-900/80 text-white" },
} as const;

type Tipo = keyof typeof TIPOS;

const AULAS: { n: number; nombre: string; dur?: number; tipo: Tipo; confirmada?: boolean }[] = [
  { n: 1,  nombre: "Activación Energética de Luz Dorada Mahatma 441 y Comandos Cuánticos de Luz",   dur: 47, tipo: "ACT", confirmada: true },
  { n: 2,  nombre: "La Ilusión del Mal, la Humildad y la Desprogramación Multidimensional",          dur: 38, tipo: "ACT", confirmada: true },
  { n: 3,  nombre: "El Futuro, la Inteligencia Artificial y la Desprogramación del Linaje",           dur: 52, tipo: "REP", confirmada: true },
  { n: 4,  nombre: "Desprogramación Profunda, Activación del ADN y Anclaje de la Alegría Divina",    dur: 61, tipo: "REP", confirmada: true },
  { n: 5,  nombre: "Códigos de Luz, Unificaciones y Sellado Áurico",                                 dur: 44, tipo: "ACT", confirmada: true },
  { n: 6,  nombre: "Portal 333 · Viaje a Salvington · Reconexión con la Misión Original",            dur: 33, tipo: "CMD", confirmada: true },
  { n: 7,  nombre: "Transfiguración Divina · Cura Planetaria · Activación de Abundancia",            dur: 56, tipo: "REP", confirmada: true },
  { n: 8,  nombre: "Activaciones, Purificación y Reconexión con el Trono Tayam",                     dur: 41, tipo: "ACT", confirmada: true },
  { n: 9,  nombre: "Meditación y Experiencias de Nuestro Vivir · Saltos Cuánticos",                  dur: 49, tipo: "MED", confirmada: true },
  { n: 10, nombre: "Programas Limitantes · Reprogramación · Activación",                             dur: 37, tipo: "CMD", confirmada: true },
  { n: 11, nombre: "Reprogramación del Tiempo Lineal",                                               dur: 58, tipo: "REP", confirmada: true },
  { n: 12, nombre: "Aplicación de Comandos y Reprogramaciones",                                      dur: 52, tipo: "ACT", confirmada: true },
  { n: 13, nombre: "Reprogramaciones Cambio Dimensional",                                            dur: 46, tipo: "MED", confirmada: true },
  { n: 14, nombre: "Reprogramaciones Sobre la Injusticia en el Mundo",                               dur: 39, tipo: "CMD", confirmada: true },
  { n: 15, nombre: "Reconexión con los Sonidos Primordiales",                                        tipo: "ACT", confirmada: true },
  { n: 16, nombre: "Activación de la Llama Violeta",              tipo: "ACT" },
  { n: 17, nombre: "Reprogramación del Linaje Paterno",           tipo: "REP" },
  { n: 18, nombre: "Meditación de las Cascadas Cósmicas",         tipo: "MED" },
  { n: 19, nombre: "Comandos de Liberación Planetaria",           tipo: "CMD" },
  { n: 20, nombre: "Activación del ADN de 12 Hebras",             tipo: "ACT" },
  { n: 21, nombre: "Sintonía con la Madre Tierra",                tipo: "MED" },
  { n: 22, nombre: "Reprogramación de la Escasez",                tipo: "REP" },
  { n: 23, nombre: "Comando del Sello Solar",                     tipo: "CMD" },
  { n: 24, nombre: "Activación de la Glándula Pineal",            tipo: "ACT" },
  { n: 25, nombre: "Meditación del Río de Luz",                   tipo: "MED" },
  { n: 26, nombre: "Reprogramación del Miedo Ancestral",          tipo: "REP" },
  { n: 27, nombre: "Comando de Unificación Cuántica",             tipo: "CMD" },
  { n: 28, nombre: "Activación de los Maestros Ascendidos",       tipo: "ACT" },
  { n: 29, nombre: "Meditación del Cristal Interno",              tipo: "MED" },
  { n: 30, nombre: "Sellado del Ego Inferior",                    tipo: "CMD" },
  { n: 31, nombre: "Reprogramación de Vidas Paralelas",           tipo: "REP" },
  { n: 32, nombre: "Activación del Cuerpo de Luz",                tipo: "ACT" },
  { n: 33, nombre: "Meditación del Maestro Interior",             tipo: "MED" },
  { n: 34, nombre: "Comando de Soberanía Energética",             tipo: "CMD" },
  { n: 35, nombre: "Reprogramación de la Identidad",              tipo: "REP" },
  { n: 36, nombre: "Activación de la Consciencia Crística",       tipo: "ACT" },
  { n: 37, nombre: "Meditación del Vacío Fértil",                 tipo: "MED" },
  { n: 38, nombre: "Comando de Servicio Planetario",              tipo: "CMD" },
  { n: 39, nombre: "Reprogramación de la Misión de Alma",         tipo: "REP" },
  { n: 40, nombre: "Activación del Sol Central",                  tipo: "ACT" },
  { n: 41, nombre: "Cierre — Ascensión Mahatma 441",              tipo: "ACT" },
];

const BONUS = { n: 42, nombre: "Activación Wesak 2026", tipo: "ACT" as Tipo };

export default async function MahatmaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user] = await sql`
    select access_status from users where id = ${session.userId}
  `;
  const isAdmin = session.role === "admin";
  if (!isAdmin && user?.access_status !== "approved") redirect("/dashboard");

  const locale = await getLocale();
  const pt = locale === "pt";

  const WHATSAPP_URL = `https://wa.me/59893422022?text=${encodeURIComponent(
    pt
      ? "Olá! Tenho interesse no programa Frecuencia Mahatma 441. Pode me dar mais informações?"
      : "Hola! Me interesa el programa Frecuencia Mahatma 441. ¿Me podés dar más información?"
  )}`;

  return (
    <div className="mx-auto max-w-4xl space-y-10">

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-terra-deep text-terra-sand">
        <div className="px-8 py-12 md:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-terra-gold">
            {pt ? "Programa de transformação quântica" : "Programa de transformación cuántica"}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            Frecuencia Mahatma 441
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-terra-sand/80">
            {pt
              ? "Um caminho de ativação, cura e reprogramação quântica que te reconecta com sua verdadeira essência e sua missão de alma. 41 aulas com ativações, meditações, reprogramações e comandos quânticos guiados por Claudio Fabián Martínez."
              : "Un camino de activación, sanación y reprogramación cuántica que te reconecta con tu verdadera esencia y tu misión de alma. 41 aulas con activaciones, meditaciones, reprogramaciones y comandos cuánticos guiados por Claudio Fabián Martínez."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://aulas.frecuencia-mahatma-441.workers.dev/landing"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-terra-gold px-6 py-2.5 font-semibold text-terra-dark hover:opacity-90"
            >
              {pt ? "Ver plataforma" : "Ver la plataforma"}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/15 px-6 py-2.5 font-semibold text-terra-sand hover:bg-white/25"
            >
              WhatsApp
            </a>
            <a
              href="mailto:esenios2022@gmail.com"
              className="rounded-full bg-white/15 px-6 py-2.5 font-semibold text-terra-sand hover:bg-white/25"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/70 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-terra-gold">
            {pt ? "Pagamento único" : "Pago único"}
          </p>
          <p className="mt-3 text-4xl font-bold text-terra-dark">R$ 2.222</p>
          <p className="mt-1 text-sm text-terra-dark/60">
            {pt ? "Acesso vitalício às 41 aulas" : "Acceso de por vida a las 41 aulas"}
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 p-6 shadow-sm md:col-span-2">
          <h3 className="font-bold text-terra-dark">
            {pt ? "O que está incluído:" : "Qué incluye:"}
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-terra-dark/80">
            <li>✓ {pt ? "41 aulas em vídeo com ativações e meditações" : "41 aulas en video con activaciones y meditaciones"}</li>
            <li>✓ {pt ? "Materiais PDF de apoio (guías e resumos)" : "Materiales PDF de apoyo (guías y resúmenes)"}</li>
            <li>✓ {pt ? "Acesso à plataforma Frecuencia Mahatma 441" : "Acceso a la plataforma Frecuencia Mahatma 441"}</li>
            <li>✓ {pt ? "Aulas bônus incluídas (Ativação Wesak 2026 e mais)" : "Aulas bonus incluidas (Activación Wesak 2026 y más)"}</li>
            <li>✓ {pt ? "Conteúdo em Espanhol e Português" : "Contenido en Español y Portugués"}</li>
          </ul>
        </div>
      </div>

      {/* Aulas list */}
      <div>
        <h2 className="text-xl font-bold text-terra-dark">
          {pt ? "As 41 aulas do programa" : "Las 41 aulas del programa"}
        </h2>
        <p className="mt-1 text-sm text-terra-dark/60">
          {pt
            ? "15 aulas já disponíveis na plataforma · restantes sendo publicadas progressivamente"
            : "15 aulas ya disponibles en la plataforma · el resto se publica progresivamente"}
        </p>

        {/* Type legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.entries(TIPOS) as [Tipo, (typeof TIPOS)[Tipo]][]).map(([key, val]) => (
            <span key={key} className={`rounded-full px-3 py-0.5 text-xs font-semibold ${val.color}`}>
              {pt ? val.pt : val.es}
            </span>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white/70">
          {AULAS.map((aula, i) => (
            <div
              key={aula.n}
              className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-terra/10" : ""} ${aula.confirmada ? "" : "opacity-60"}`}
            >
              <span className="w-7 flex-none text-center text-sm font-bold text-terra-gold">
                {aula.n}
              </span>
              <span className="flex-1 text-sm text-terra-dark">{aula.nombre}</span>
              {aula.dur && (
                <span className="flex-none text-xs text-terra-dark/50">{aula.dur} min</span>
              )}
              <span className={`flex-none rounded-full px-2 py-0.5 text-xs font-semibold ${TIPOS[aula.tipo].color}`}>
                {pt ? TIPOS[aula.tipo].pt : TIPOS[aula.tipo].es}
              </span>
              {!aula.confirmada && (
                <span className="flex-none rounded-full bg-terra-dark/10 px-2 py-0.5 text-xs text-terra-dark/50">
                  {pt ? "Em breve" : "Próximamente"}
                </span>
              )}
            </div>
          ))}
          {/* Bonus */}
          <div className="flex items-center gap-3 border-t-2 border-terra-gold/40 bg-terra-gold/5 px-4 py-3">
            <span className="w-7 flex-none text-center text-sm font-bold text-terra-gold">★</span>
            <span className="flex-1 text-sm font-medium text-terra-dark">{BONUS.nombre}</span>
            <span className={`flex-none rounded-full px-2 py-0.5 text-xs font-semibold ${TIPOS[BONUS.tipo].color}`}>
              {pt ? TIPOS[BONUS.tipo].pt : TIPOS[BONUS.tipo].es}
            </span>
            <span className="flex-none rounded-full bg-terra-gold/30 px-2 py-0.5 text-xs font-semibold text-terra-dark">
              Bonus
            </span>
          </div>
        </div>
      </div>

      {/* Therapist */}
      <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
        <h3 className="font-bold text-terra-dark">
          {pt ? "Seu guia nesta jornada" : "Tu guía en este camino"}
        </h3>
        <p className="mt-1 text-lg font-semibold text-terra-dark">Claudio Fabián Martínez</p>
        <p className="mt-2 text-sm text-terra-dark/70">
          {pt
            ? "Terapeuta multidimensional quântico com mais de 10 anos de experiência. Iniciado em múltiplas tradições (ThetaHealing®, Terapia Quântica Atlante, Medicina Orisha, práticas andinas). Fundador do programa Frecuencia Mahatma 441 e da plataforma Terra Araras."
            : "Terapeuta multidimensional cuántico con más de 10 años de experiencia. Iniciado en múltiples tradiciones (ThetaHealing®, Terapia Cuántica Atlante, Medicina Orisha, prácticas andinas). Fundador del programa Frecuencia Mahatma 441 y de la plataforma Terra Araras."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://claudio-martinez-terapeuta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-terra-dark/30 px-4 py-1.5 text-sm font-semibold text-terra-dark hover:bg-terra-dark/5"
          >
            {pt ? "Ver site pessoal" : "Ver sitio personal"}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
          <a
            href="mailto:esenios2022@gmail.com"
            className="rounded-full border border-terra-dark/30 px-4 py-1.5 text-sm font-semibold text-terra-dark hover:bg-terra-dark/5"
          >
            Email
          </a>
        </div>
      </div>

      {/* Back */}
      <div>
        <Link href="/dashboard" className="text-sm text-terra-dark/60 hover:underline">
          ← {pt ? "Voltar ao painel" : "Volver al panel"}
        </Link>
      </div>
    </div>
  );
}
