"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SiteContentItem = {
  id?: number;
  key: string;
  value: string;
};

type Service = {
  id?: number;
  category: string;
  name: string;
  price: string;
  description?: string | null;
  position?: number;
  active?: boolean;
};

type GalleryImage = {
  id?: number;
  beforeUrl: string;
  afterUrl: string;
  position?: number;
  active?: boolean;
};

type ServiceGroup = {
  category: string;
  services: Service[];
};

const defaultContent: Record<string, string> = {
  site_name: "Coupe de Woof",
  hero_kicker: "SALON DE TOILETTAGE",
  hero_location: "LE LOROUX-BOTTEREAU",
  hero_title: "Votre compagnon,\nnotre attention.",
  hero_description:
    "Toilettage, soins et mise en beauté\npour chiens, chats et NAC.",
  hero_categories: "CHIENS • CHATS • NAC",
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  contact_instagram: "@coupedewoof",
  opening_hours:
    "Lundi : 9h00 – 18h00\nMardi : 9h00 – 18h00\nMercredi : 9h00 – 18h00\nJeudi : 9h00 – 18h00\nVendredi : 9h00 – 18h00\nSamedi : 9h00 – 17h00\nDimanche : Fermé",
};

const defaultServices: Service[] = [
  {
    category: "CHIENS",
    name: "Toilettage complet",
    price: "À partir de 45 €",
    description:
      "Bain, séchage, coupe, finitions et soins adaptés au pelage.",
    position: 1,
  },
  {
    category: "CHIENS",
    name: "Bain & séchage",
    price: "À partir de 30 €",
    description:
      "Nettoyage en profondeur, séchage et mise en beauté du pelage.",
    position: 2,
  },
  {
    category: "CHIENS",
    name: "Coupe des griffes",
    price: "À partir de 10 €",
    description: "Une prestation rapide pour garder les griffes confortables.",
    position: 3,
  },
  {
    category: "CHATS",
    name: "Toilettage chat",
    price: "À partir de 40 €",
    description:
      "Soins doux et adaptés aux besoins spécifiques de votre chat.",
    position: 1,
  },
  {
    category: "NAC",
    name: "Soins NAC",
    price: "Sur devis",
    description:
      "Prestations adaptées aux petits animaux de compagnie.",
    position: 1,
  },
];

const defaultGallery: GalleryImage[] = [
  {
    position: 1,
    beforeUrl: "/images/avant1.jpeg",
    afterUrl: "/images/apres1.jpeg",
  },
  {
    position: 2,
    beforeUrl: "/images/avant2.jpeg",
    afterUrl: "/images/apres2.jpeg",
  },
  {
    position: 3,
    beforeUrl: "/images/avant3.jpeg",
    afterUrl: "/images/apres3.jpeg",
  },
  {
    position: 4,
    beforeUrl: "/images/avant4.jpeg",
    afterUrl: "/images/apres4.jpeg",
  },
];

function getContentValue(
  content: SiteContentItem[],
  key: string
): string {
  return content.find((item) => item.key === key)?.value ?? defaultContent[key] ?? "";
}

function groupServices(services: Service[]): ServiceGroup[] {
  const groups = new Map<string, Service[]>();

  for (const service of services) {
    if (!service.active && service.active !== undefined) continue;

    const category = service.category || "AUTRES";

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category)!.push(service);
  }

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    services: [...items].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    ),
  }));
}

function formatMultilineText(value: string) {
  return value.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < value.split("\n").length - 1 && <br />}
    </span>
  ));
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-10 w-10"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="7" />
      <circle cx="18" cy="46" r="7" />
      <path d="M24 23 54 9" />
      <path d="M24 41 54 55" />
      <path d="M27 30 54 9" />
      <path d="M27 34 54 55" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M18 28c-2-8 2-15 10-15 2-5 6-7 10-4 4-3 9 0 9 6 7 1 10 7 8 13l-3 10c-2 8-9 13-18 13s-16-5-18-13l-3-10Z" />
      <circle cx="27" cy="31" r="2" fill="currentColor" />
      <circle cx="41" cy="31" r="2" fill="currentColor" />
      <path d="M29 41c2 2 6 2 8 0" />
      <path d="M20 19 13 11" />
      <path d="M45 17 52 10" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="m18 23 2-12 10 7c2-1 4-1 6-1s4 0 6 1l10-7 2 12c3 4 4 8 4 13 0 11-9 18-22 18S14 47 14 36c0-5 1-9 4-13Z" />
      <circle cx="25" cy="34" r="2" fill="currentColor" />
      <circle cx="39" cy="34" r="2" fill="currentColor" />
      <path d="M28 43c3 2 5 2 8 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2a4.8 4.8 0 0 1 4.8 4.8Z" />
    </svg>
  );
}

function GalleryPair({
  item,
  index,
}: {
  item: GalleryImage;
  index: number;
}) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#cfa97c]/20 bg-[#fff9eb]/5 shadow-2xl shadow-black/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={showAfter ? item.afterUrl : item.beforeUrl}
          alt={
            showAfter
              ? `Résultat toilettage ${index + 1}`
              : `Avant toilettage ${index + 1}`
          }
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <div className="absolute left-4 top-4 rounded-full bg-[#3a2c20]/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3e9d0] backdrop-blur-sm">
          {showAfter ? "Après" : "Avant"}
        </div>

        <button
          type="button"
          onClick={() => setShowAfter((current) => !current)}
          className="absolute bottom-4 right-4 rounded-full border border-[#f3e9d0]/50 bg-[#3a2c20]/85 px-4 py-2 text-xs font-semibold text-[#f3e9d0] backdrop-blur-sm transition hover:bg-[#3a2c20]"
        >
          {showAfter ? "Voir avant" : "Voir après"}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [content, setContent] = useState<SiteContentItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const response = await fetch("/api/admin/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Impossible de récupérer le contenu.");
        }

        const data = await response.json();

        if (cancelled) return;

        setContent(Array.isArray(data.siteContent) ? data.siteContent : []);
        setServices(Array.isArray(data.services) ? data.services : []);
        setGallery(Array.isArray(data.gallery) ? data.gallery : []);
      } catch (error) {
        console.error("Erreur chargement contenu :", error);
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const siteName = getContentValue(content, "site_name");
  const heroKicker = getContentValue(content, "hero_kicker");
  const heroLocation = getContentValue(content, "hero_location");
  const heroTitle = getContentValue(content, "hero_title");
  const heroDescription = getContentValue(content, "hero_description");
  const heroCategories = getContentValue(content, "hero_categories");
  const contactPhone = getContentValue(content, "contact_phone");
  const contactEmail = getContentValue(content, "contact_email");
  const contactAddress = getContentValue(content, "contact_address");
  const contactInstagram = getContentValue(content, "contact_instagram");
  const openingHours = getContentValue(content, "opening_hours");

  const serviceGroups = useMemo(() => {
    if (services.length === 0) {
      return groupServices(defaultServices);
    }

    return groupServices(services);
  }, [services]);

  const galleryItems =
    gallery.length > 0 ? gallery : defaultGallery;

  const instagramUrl = contactInstagram
    ? contactInstagram.startsWith("http")
      ? contactInstagram
      : `https://www.instagram.com/${contactInstagram.replace(/^@/, "")}/`
    : "https://www.instagram.com/coupedewoof/";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#3a2c20] text-[#f3e9d0]">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
          {/* LOGO + NOM DU SITE */}
          <a
            href="#accueil"
            className="flex shrink-0 items-center gap-2 text-[#f3e9d0] drop-shadow-lg"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f3e9d0] sm:h-11 sm:w-11">
              <Image
                src="/images/logo.jpeg"
                alt="Logo Coupe de Woof"
                fill
                className="object-contain"
                sizes="44px"
              />
            </div>

            <span className="whitespace-nowrap font-display text-lg tracking-wide sm:text-xl">
              {siteName}
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-[#f3e9d0] md:flex">
            <a
              href="#prestations"
              className="transition hover:text-[#cfa97c]"
            >
              Prestations
            </a>
            <a
              href="#galerie"
              className="transition hover:text-[#cfa97c]"
            >
              Galerie
            </a>
            <a
              href="#contact"
              className="transition hover:text-[#cfa97c]"
            >
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="shrink-0 whitespace-nowrap rounded-full bg-[#3a2c20] px-3 py-2 text-xs font-semibold text-[#f3e9d0] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#4a3828] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Nous contacter
          </a>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section
        id="accueil"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* PHOTO DE FOND */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-final.jpeg"
            alt="Chien dans la neige"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-[#160f0a]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#160f0a]/95 via-[#160f0a]/65 to-[#160f0a]/30" />

        {/* FORME CIRCULAIRE */}
        <div className="absolute -right-40 -top-32 h-[560px] w-[560px] rounded-full border border-[#f3e9d0]/15 bg-[#f3e9d0]/5 blur-[1px] md:h-[680px] md:w-[680px]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-20 pt-32 lg:px-10">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-7">
              <span className="h-px w-20 bg-[#cfa97c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[#f3e9d0] sm:text-sm">
                {heroKicker}
              </span>
            </div>

            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.42em] text-[#cfa97c] sm:text-sm">
              {heroLocation}
            </p>

            <h1 className="max-w-4xl whitespace-pre-line font-display text-[4.3rem] leading-[0.91] tracking-[-0.045em] text-[#f3e9d0] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.3rem]">
              {heroTitle}
            </h1>

            <div className="mt-12 flex items-center gap-7 text-[#cfa97c]">
              <span className="h-px w-24 bg-[#cfa97c]" />
              <ScissorsIcon />
              <span className="h-px w-24 bg-[#cfa97c]" />
            </div>

            <p className="mt-7 max-w-xl font-times text-xl leading-8 text-[#f3e9d0]/95 sm:text-2xl">
              Toilettage, soins et mise en beauté{" "}

              <br className="hidden sm:block" />

              pour chiens, chats et NAC.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#f3e9d0]/80 sm:text-xs">
              {heroCategories
                .split("•")
                .map((category, index, array) => (
                  <span
                    key={`${category}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span>{category.trim()}</span>
                    {index < array.length - 1 && (
                      <span className="text-[#cfa97c]">•</span>
                    )}
                  </span>
                ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <a
                href="#prestations"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#b67c43] px-8 py-4 text-sm font-semibold text-[#fff9eb] shadow-xl shadow-black/25 transition-all hover:-translate-y-1 hover:bg-[#c58c52]"
              >
                Découvrir les prestations
                <ArrowIcon />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-[#f3e9d0]/60 px-8 py-4 text-sm font-semibold text-[#f3e9d0] transition-all hover:-translate-y-1 hover:bg-[#f3e9d0]/10"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>

        {/* INDICATEUR */}
        <a
          href="#prestations"
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-[#f3e9d0]/70 sm:flex"
        >
          <span className="text-xl">↓</span>
          <span className="text-[9px] uppercase tracking-[0.5em]">
            Découvrir
          </span>
        </a>
      </section>

      {/* =========================================================
          PRESTATIONS
      ========================================================== */}
      <section
        id="prestations"
        className="relative overflow-hidden bg-[#3a2c20] py-24 sm:py-32"
      >
        <div className="absolute right-[-250px] top-[-250px] h-[600px] w-[600px] rounded-full border border-[#cfa97c]/10" />
        <div className="absolute bottom-[-350px] left-[-300px] h-[650px] w-[650px] rounded-full border border-[#cfa97c]/10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 max-w-3xl">
            <div className="mb-7 flex items-center gap-7">
              <span className="h-px w-20 bg-[#cfa97c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[#cfa97c] sm:text-sm">
                Prestations & tarifs
              </span>
            </div>

            <h2 className="font-display text-5xl leading-none tracking-[-0.04em] text-[#f3e9d0] sm:text-6xl md:text-7xl">
              Prendre soin de
              <br />
              <span className="text-[#cfa97c]">votre compagnon.</span>
            </h2>

            <p className="mt-7 max-w-2xl font-times text-lg leading-8 text-[#f3e9d0]/75 sm:text-xl">
              Des prestations pensées pour offrir à chaque animal un moment
              de soin, de confort et de beauté.
            </p>
          </div>

          {!loaded && (
            <div className="mb-10 rounded-[2rem] border border-[#cfa97c]/20 bg-[#fff9eb]/5 p-8 text-[#f3e9d0]/70">
              Chargement des prestations…
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {serviceGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-[2rem] border border-[#cfa97c]/20 bg-[#fff9eb]/5 p-7 shadow-2xl shadow-black/10 backdrop-blur-sm sm:p-8"
              >
                <div className="mb-8 flex items-center justify-between border-b border-[#cfa97c]/20 pb-6">
                  <h3 className="font-display text-3xl text-[#f3e9d0]">
                    {group.category}
                  </h3>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cfa97c]/30 text-[#cfa97c]">
                    {group.category.toUpperCase() === "CHIENS" ? (
                      <DogIcon />
                    ) : group.category.toUpperCase() === "CHATS" ? (
                      <CatIcon />
                    ) : (
                      <HeartIcon />
                    )}
                  </div>
                </div>

                <div className="space-y-7">
                  {group.services.map((service) => (
                    <article key={service.id ?? `${group.category}-${service.name}`}>
                      <div className="flex items-start justify-between gap-5">
                        <h4 className="font-display text-xl leading-tight text-[#f3e9d0]">
                          {service.name}
                        </h4>

                        <span className="shrink-0 text-sm font-semibold text-[#cfa97c]">
                          {service.price}
                        </span>
                      </div>

                      {service.description && (
                        <p className="mt-3 font-times text-sm leading-6 text-[#f3e9d0]/65">
                          {service.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-[#cfa97c]/20 bg-[#fff9eb]/5 p-7 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                  Une demande particulière ?
                </p>

                <p className="mt-3 font-times text-lg text-[#f3e9d0]/80">
                  Contactez-nous pour connaître la prestation la plus adaptée.
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#b67c43] px-7 py-3.5 text-sm font-semibold text-[#fff9eb] transition hover:bg-[#c58c52]"
              >
                Nous contacter
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          GALERIE
      ========================================================== */}
      <section
        id="galerie"
        className="relative overflow-hidden bg-[#f3e9d0] py-24 text-[#3a2c20] sm:py-32"
      >
        <div className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full border border-[#3a2c20]/10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-7 flex items-center gap-7">
                <span className="h-px w-20 bg-[#b67c43]" />
                <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b67c43] sm:text-sm">
                  Galerie
                </span>
              </div>

              <h2 className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl md:text-7xl">
                Avant.
                <br />
                <span className="text-[#b67c43]">Après.</span>
              </h2>
            </div>

            <p className="max-w-md font-times text-lg leading-8 text-[#3a2c20]/65 sm:text-xl">
              Découvrez quelques transformations réalisées avec soin pour
              révéler toute la beauté de nos compagnons.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            {galleryItems.map((item, index) => (
              <GalleryPair
                key={item.id ?? index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT
      ========================================================== */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[#3a2c20] py-24 sm:py-32"
      >
        <div className="absolute left-[-280px] top-[-280px] h-[650px] w-[650px] rounded-full border border-[#cfa97c]/10" />
        <div className="absolute right-[-280px] bottom-[-350px] h-[700px] w-[700px] rounded-full border border-[#cfa97c]/10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="mb-7 flex items-center gap-7">
                <span className="h-px w-20 bg-[#cfa97c]" />
                <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[#cfa97c] sm:text-sm">
                  Contact
                </span>
              </div>

              <h2 className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl md:text-7xl">
                Parlons de
                <br />
                <span className="text-[#cfa97c]">votre compagnon.</span>
              </h2>

              <p className="mt-8 max-w-xl font-times text-lg leading-8 text-[#f3e9d0]/70 sm:text-xl">
                Une question, une demande de tarif ou simplement envie de
                prendre rendez-vous ? Contactez-nous directement.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#b67c43] px-7 py-3.5 text-sm font-semibold text-[#fff9eb] transition hover:bg-[#c58c52]"
                >
                  Instagram
                </a>

                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center rounded-full border border-[#f3e9d0]/50 px-7 py-3.5 text-sm font-semibold text-[#f3e9d0] transition hover:bg-[#f3e9d0]/10"
                  >
                    Appeler
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#cfa97c]/20 bg-[#fff9eb]/5 p-8 shadow-2xl shadow-black/10 backdrop-blur-sm sm:p-10">
              <div className="space-y-8">
                {contactAddress && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                      Adresse
                    </p>
                    <p className="mt-3 whitespace-pre-line font-times text-lg leading-7 text-[#f3e9d0]">
                      {contactAddress}
                    </p>
                  </div>
                )}

                {contactPhone && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                      Téléphone
                    </p>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="mt-3 block font-times text-lg text-[#f3e9d0] transition hover:text-[#cfa97c]"
                    >
                      {contactPhone}
                    </a>
                  </div>
                )}

                {contactEmail && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                      Email
                    </p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-3 block break-all font-times text-lg text-[#f3e9d0] transition hover:text-[#cfa97c]"
                    >
                      {contactEmail}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                    Instagram
                  </p>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block font-times text-lg text-[#f3e9d0] transition hover:text-[#cfa97c]"
                  >
                    {contactInstagram || "@coupedewoof"}
                  </a>
                </div>

                <div className="border-t border-[#cfa97c]/20 pt-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                    Horaires
                  </p>

                  <p className="mt-4 whitespace-pre-line font-times text-base leading-7 text-[#f3e9d0]/80">
                    {openingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-[#cfa97c]/15 bg-[#2c2118] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-10">
          <p className="font-display text-lg text-[#f3e9d0]">
            {siteName}
          </p>

          <p className="text-xs uppercase tracking-[0.25em] text-[#f3e9d0]/45">
            Toilettage • Soins • Bien-être
          </p>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-[#cfa97c] transition hover:text-[#f3e9d0]"
          >
            {contactInstagram || "@coupedewoof"}
          </a>
        </div>
      </footer>
    </main>
  );
}